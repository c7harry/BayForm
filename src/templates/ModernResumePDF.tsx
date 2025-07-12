import React, { useMemo } from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ResumeData } from '../types/resume';
import QRCode from 'qrcode';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
    marginRight: 12,
  },
  profileAndQRContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: -45,
    marginTop: -10,
  },
  profileImage: {
    width: 55,
    height: 55,
    marginBottom: 0,
    marginRight: 8,
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: '#000000FF',
    borderRadius: 8,
  },
  qrCode: {
    width: 55,
    height: 55,
    marginRight: 16,
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: '#222222',
    borderRadius: 8,
  },
  name: {
    fontSize: 24.5,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16, // position title
    color: '#000000',
    marginBottom: 4,
    fontWeight: 'bold',
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 10, // user info
    color: '#000000',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  separator: {
    color: '#000000',
    paddingLeft: 4,
    paddingRight: 0,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 11.3, // section titles
    fontWeight: 'bold',
    color: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 1,
    marginTop: 3,
    marginBottom: 1,
    textAlign: 'center',
  },
  sectionTitleContainer: {
    marginBottom: 1,
  },
  skillsContainer: {
    alignItems: 'center',
    width: '100%',
  },
  skillCategory: {
    flexDirection: 'row',
    marginBottom: 1,
    justifyContent: 'center',
    width: '100%',
  },
  skillCategoryLabel: {
    fontSize: 10.3, // skills content
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'capitalize',
    marginRight: 0,
    textAlign: 'center',
  },
  skillsList: {
    fontSize: 10.3, // skills content
    color: '#000000',
    textAlign: 'center',
  },
  companyHeader: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    paddingLeft: 8,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 11, // company name
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 0,
  },
  companyLocation: {
    fontSize: 10,
    color: '#000000',
  },
  positionContainer: {
    marginBottom: 4,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  positionTitle: {
    fontSize: 11, // job title
    fontWeight: 'bold',
    color: '#000000',
  },
  dateRange: {
    fontSize: 10.3, // date
    color: '#000000',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 10.5, // job description
    color: '#000000',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  achievementsList: {
    marginTop: 1,
  },
  achievement: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  bullet: {
    color: '#000000',
    marginRight: 6,
    fontSize: 10,
  },
  achievementText: {
    fontSize: 10.5, // key achievements
    color: '#000000',
    flex: 1,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  educationLeft: {
    flex: 1,
  },
  educationRight: {
    alignItems: 'flex-end',
  },
  degree: {
    fontSize: 10.3, // education contents
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 0,
  },
  institution: {
    fontSize: 10.3, // education contents
    color: '#000000',
    fontStyle: 'italic',
  },
  honors: {
    fontSize: 10.3, // education contents
    color: '#000000',
  },
  graduationDate: {
    fontSize: 10.3, // education contents
    color: '#000000',
  },
  gpa: {
    fontSize: 10.3,
    color: '#000000',
    fontStyle: 'italic',
    marginTop: 1,
  },
  educationItem: {
    marginBottom: 0,
    paddingBottom: 2,
    borderBottomWidth: 0,
    borderBottomColor: '#e5e7eb',
    borderStyle: 'solid',
  },
  projectItem: {
    marginBottom: 2,
  },
  projectName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 0,
  },
  projectDescription: {
    fontSize: 9,
    color: '#000000',
    marginBottom: 1,
  },
  technologiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 1,
  },
  technologyTag: {
    backgroundColor: '#F3F4F6',
    color: '#000000',
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 4,
    marginBottom: 1,
    borderRadius: 2,
  },
  projectLinks: {
    fontSize: 9,
    color: '#000000',
  },
  additionalSection: {
    marginBottom: 1,
  },
  additionalSectionRow: {
    flexDirection: 'row',
  },
  additionalSectionLabel: {
    fontSize: 10.3, // additional information
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'capitalize',
    marginRight: 5,
  },
  additionalSectionContent: {
    fontSize: 10.3, // additional information
    color: '#000000',
  },
  experienceItem: {
    marginBottom: 1.5, // reduced from 2
    paddingBottom: 1.5, // reduced from 2
  },
  contactItem: {
    fontSize: 10,
    color: '#000000',
    fontWeight: 'normal',
  },
});

function formatPhoneNumber(phone: string) {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export async function generateQRCodeDataURL(text: string, size: number = 150): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    return '';
  }
}

export async function getQRCodeURL(personalInfo: ResumeData['personalInfo']): Promise<string | null> {
  if (!personalInfo.qrCode?.enabled || personalInfo.qrCode.type === 'none') {
    return null;
  }

  let qrValue = '';
  
  if (personalInfo.qrCode.type === 'linkedin' && personalInfo.linkedIn) {
    qrValue = personalInfo.linkedIn.startsWith('http') 
      ? personalInfo.linkedIn 
      : `https://linkedin.com/in/${personalInfo.linkedIn}`;
  } else if (personalInfo.qrCode.type === 'website' && personalInfo.website) {
    qrValue = personalInfo.website.startsWith('http') 
      ? personalInfo.website 
      : `https://${personalInfo.website}`;
  }

  return qrValue ? await generateQRCodeDataURL(qrValue, 150) : null;
}

function groupExperiencesByCompany(experiences: ResumeData['experience']) {
  const grouped: { [company: string]: ResumeData['experience'] } = {};
  
  experiences.forEach(exp => {
    const normalizedCompany = exp.company.trim();
    const groupKey = normalizedCompany;
    
    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push(exp);
  });

  Object.keys(grouped).forEach(company => {
    grouped[company].sort((a, b) => {
      const parseDate = (dateStr: string) => {
        if (!dateStr) return new Date(0);
        if (/^\d{4}$/.test(dateStr)) {
          return new Date(parseInt(dateStr), 0);
        }
        if (/^\d{2}\/\d{4}$/.test(dateStr)) {
          const [month, year] = dateStr.split('/');
          return new Date(parseInt(year), parseInt(month) - 1);
        }
        if (/^[A-Za-z]+ \d{4}$/.test(dateStr)) {
          return new Date(dateStr);
        }
        return new Date(dateStr);
      };
      
      const dateA = parseDate(a.startDate);
      const dateB = parseDate(b.startDate);
      return dateB.getTime() - dateA.getTime();
    });
  });

  return grouped;
}

function validateBase64Image(base64String: string): string | null {
  if (!base64String) return null;
  
  if (base64String.startsWith('data:image/')) {
    return base64String;
  }
  
  if (base64String.startsWith('/9j/') || base64String.startsWith('iVBORw0KGgo')) {
    const mimeType = base64String.startsWith('/9j/') ? 'jpeg' : 'png';
    return `data:image/${mimeType};base64,${base64String}`;
  }
  
  if (base64String.startsWith('http')) {
    return base64String;
  }
  
  return null;
}

export const ModernResumePDF: React.FC<{ 
  resumeData: ResumeData; 
  qrCodeDataURL?: string | null;
}> = ({ resumeData, qrCodeDataURL }) => {
  const skillsByCategory: Record<string, string[]> = {};
  resumeData.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(skill.name);
  });

  const contactItems = [
    resumeData.personalInfo.location,
    resumeData.personalInfo.email,
    formatPhoneNumber(resumeData.personalInfo.phone),
    resumeData.personalInfo.website,
    resumeData.personalInfo.linkedIn,
  ].filter(Boolean);

  const validatedProfilePicture = validateBase64Image(resumeData.personalInfo.profilePicture || '');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.name}>{resumeData.personalInfo.fullName}</Text>
            {resumeData.personalInfo.professionTitle && (
              <Text style={styles.title}>{resumeData.personalInfo.professionTitle}</Text>
            )}
          </View>
          {(validatedProfilePicture || qrCodeDataURL) && (
            <View style={styles.profileAndQRContainer}>
              {qrCodeDataURL && (
                <Image 
                  style={styles.qrCode} 
                  src={qrCodeDataURL} 
                />
              )}
              {validatedProfilePicture && (
                <Image 
                  style={styles.profileImage} 
                  src={validatedProfilePicture} 
                />
              )}
            </View>
          )}
        </View>

        <View style={styles.contactInfo}>
          {contactItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <Text style={{ color: '#000000', marginHorizontal: 4, fontSize: 12, fontWeight: 'bold' }}>|</Text>
              )}
              <Text style={styles.contactItem}>{item}</Text>
            </React.Fragment>
          ))}
        </View>

        {Object.keys(skillsByCategory).length > 0 && (
          <View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>SKILLS</Text>
            </View>
            <View style={styles.skillsContainer}>
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <View key={category} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryLabel}>{category}:</Text>
                  <Text style={styles.skillsList}>{skills.join(', ')}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {resumeData.experience.length > 0 && (
          <View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>EXPERIENCE</Text>
            </View>
            {Object.entries(groupExperiencesByCompany(resumeData.experience)).map(([company, experiences], companyIdx, companyArr) => (
              <View
                key={company}
                style={[
                  styles.experienceItem,
                  ...(companyIdx === companyArr.length - 1 ? [{ borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }] : [])
                ]}
              >
                {/* Company and Location in bold */}
                <Text style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 0 }}>
                  {company} - {experiences[0].location}
                </Text>
                {experiences.map((exp) => (
                  <View key={exp.id} style={{ marginBottom: 4 }}>
                    {/* Position and Type in italic */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                      <Text style={{ fontStyle: 'italic', fontSize: 13 }}>
                        {exp.position}
                      </Text>
                      <Text style={styles.dateRange}>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </Text>
                    </View>
                    {exp.description && (
                      <Text style={{ ...styles.description, marginBottom: 2 }}>{exp.description}</Text>
                    )}
                    {exp.achievements.length > 0 && (
                      <View style={{ ...styles.achievementsList, marginBottom: 2 }}>
                        {exp.achievements.map((achievement: string, index: number) => (
                          <View key={index} style={styles.achievement}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.achievementText}>{achievement}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {resumeData.education.length > 0 && (
          <View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>EDUCATION</Text>
            </View>
            {resumeData.education.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <View style={styles.educationLeft}>
                    <Text style={styles.degree}>{edu.degree} in {edu.field}</Text>
                    <Text style={styles.institution}>{edu.institution}</Text>
                    {Array.isArray(edu.honors) && edu.honors.length > 0 && (
                      <View style={{ marginTop: 1 }}>
                        {edu.honors.map((honor, idx) => (
                          <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 0 }}>
                            <Text style={{ color: '#000000', marginRight: 4, fontSize: 10.3 }}>•</Text>
                            <Text style={styles.honors}>{honor}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                  <View style={styles.educationRight}>
                    <Text style={styles.graduationDate}>{edu.graduationDate}</Text>
                    {edu.gpa && <Text style={styles.gpa}>GPA: {edu.gpa}</Text>}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {resumeData.projects.length > 0 && (
          <View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>PROJECTS</Text>
            </View>
            {resumeData.projects.map((project) => (
              <View key={project.id} style={styles.projectItem}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectDescription}>{project.description}</Text>
                {project.technologies.length > 0 && (
                  <View style={styles.technologiesContainer}>
                    {project.technologies.map((tech, index) => (
                      <Text key={index} style={styles.technologyTag}>{tech}</Text>
                    ))}
                  </View>
                )}
                {(project.url || project.github) && (
                  <Text style={styles.projectLinks}>
                    {project.url && `Live: ${project.url}`}
                    {project.url && project.github && ' | '}
                    {project.github && `GitHub: ${project.github}`}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {resumeData.additionalSections && resumeData.additionalSections.length > 0 && (
          <View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>ADDITIONAL INFORMATION</Text>
            </View>
            {resumeData.additionalSections
              .filter(section => section.items && section.items.length > 0)
              .map(section => (
                <View key={section.id} style={styles.additionalSection}>
                  <View style={styles.additionalSectionRow}>
                    <Text style={styles.additionalSectionLabel}>{section.title}:</Text>
                    <Text style={styles.additionalSectionContent}>{section.items.join(', ')}</Text>
                  </View>
                </View>
              ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
