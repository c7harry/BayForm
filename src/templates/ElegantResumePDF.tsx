import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ResumeData } from '../types/resume';
import { generateQRCodeDataURL, getQRCodeURL } from './ModernResumePDF';

// Elegant template styles - sophisticated, serif fonts, centered header, elegant lines
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    textAlign: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  headerTopLine: {
    position: 'absolute',
    top: 0,
    left: '37.5%',
    width: '25%',
    height: 1,
    backgroundColor: '#D97706',
  },
  headerBottomLine: {
    position: 'absolute',
    bottom: 0,
    left: '37.5%',
    width: '25%',
    height: 1,
    backgroundColor: '#D97706',
  },
  profileAndQRContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileImage: {
    width: 45,
    height: 45,
    marginRight: 8,
  },
  qrCode: {
    width: 45,
    height: 45,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: 2,
    textAlign: 'center',
    fontFamily: 'Times-Bold',
  },
  title: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'normal',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 9,
    color: '#6B7280',
  },
  contactItem: {
    textAlign: 'center',
  },
  contactSeparator: {
    width: 3,
    height: 3,
    backgroundColor: '#9CA3AF',
    borderRadius: 2,
    marginHorizontal: 12,
  },
  mainContent: {
    flexDirection: 'row',
    gap: 20,
  },
  leftColumn: {
    width: '25%',
  },
  rightColumn: {
    width: '75%',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingBottom: 2,
    marginBottom: 8,
    marginTop: 16,
    fontFamily: 'Times-Bold',
  },
  skillCategory: {
    marginBottom: 8,
  },
  skillCategoryTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  skillsContainer: {
    marginBottom: 4,
  },
  skillItem: {
    fontSize: 9,
    color: '#374151',
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 2,
    marginBottom: 2,
  },
  additionalSection: {
    marginBottom: 8,
  },
  additionalTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  additionalItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  additionalBullet: {
    width: 3,
    height: 3,
    backgroundColor: '#9CA3AF',
    borderRadius: 2,
    marginRight: 8,
    marginTop: 3,
  },
  additionalText: {
    fontSize: 8,
    color: '#374151',
    flex: 1,
  },
  experienceItem: {
    marginBottom: 12,
    position: 'relative',
  },
  companyHeader: {
    marginBottom: 8,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
    paddingLeft: 8,
    fontFamily: 'Times-Bold',
  },
  companyLocation: {
    fontSize: 8,
    color: '#6B7280',
    paddingLeft: 8,
    marginTop: 2,
    fontStyle: 'italic',
  },
  positionContainer: {
    marginBottom: 8,
    paddingLeft: 24,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  positionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  dateRange: {
    fontSize: 8,
    color: '#6B7280',
  },
  description: {
    fontSize: 9,
    color: '#374151',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  achievementsList: {
    marginTop: 2,
  },
  achievement: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 3,
    height: 3,
    backgroundColor: '#D97706',
    borderRadius: 2,
    marginRight: 8,
    marginTop: 3,
  },
  achievementText: {
    fontSize: 9,
    color: '#374151',
    flex: 1,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  column: {
    flex: 1,
  },
  educationItem: {
    marginBottom: 8,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  educationLeft: {
    flex: 1,
  },
  educationRight: {
    alignItems: 'flex-end',
  },
  degree: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 1,
  },
  field: {
    fontSize: 8,
    color: '#374151',
  },
  institution: {
    fontSize: 9,
    color: '#374151',
    fontStyle: 'italic',
  },
  honors: {
    fontSize: 8,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 2,
  },
  graduationDate: {
    fontSize: 8,
    color: '#6B7280',
  },
  gpa: {
    fontSize: 8,
    color: '#6B7280',
  },
  projectItem: {
    marginBottom: 8,
  },
  projectName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 8,
    color: '#374151',
    marginBottom: 4,
  },
  technologiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  technologyTag: {
    backgroundColor: '#F3F4F6',
    color: '#374151',
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 4,
    marginBottom: 1,
    borderRadius: 2,
  },
  projectLinks: {
    fontSize: 8,
    color: '#6B7280',
  },
});

// Helper to format phone numbers
function formatPhoneNumber(phone: string) {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

// Helper to group experiences by company
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

  // Sort experiences within each company by start date (most recent first)
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

// Elegant Resume PDF Component
export const ElegantResumePDF: React.FC<{ 
  resumeData: ResumeData; 
  qrCodeDataURL?: string | null;
}> = ({ resumeData, qrCodeDataURL }) => {
  // Group skills by category
  const skillsByCategory: Record<string, string[]> = {};
  resumeData.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
    skillsByCategory[skill.category].push(skill.name);
  });

  // Prepare contact info items
  const contactItems = [
    resumeData.personalInfo.email,
    formatPhoneNumber(resumeData.personalInfo.phone),
    resumeData.personalInfo.location,
    resumeData.personalInfo.website,
    resumeData.personalInfo.linkedIn,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Elegant Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTopLine} />
          
          {/* Profile picture and QR Code container */}
          <View style={styles.profileAndQRContainer}>
            {resumeData.personalInfo.profilePicture && (
              <Image style={styles.profileImage} src={resumeData.personalInfo.profilePicture} />
            )}
            {qrCodeDataURL && (
              <Image style={styles.qrCode} src={qrCodeDataURL} />
            )}
          </View>
          
          <Text style={styles.name}>{resumeData.personalInfo.fullName}</Text>
          {resumeData.personalInfo.professionTitle && (
            <Text style={styles.title}>{resumeData.personalInfo.professionTitle}</Text>
          )}
          <View style={styles.contactInfo}>
            {contactItems.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <View style={styles.contactSeparator} />}
                <Text style={styles.contactItem}>{item}</Text>
              </React.Fragment>
            ))}
          </View>
          <View style={styles.headerBottomLine} />
        </View>

        {/* Two-column layout */}
        <View style={styles.mainContent}>
          {/* Left sidebar */}
          <View style={styles.leftColumn}>
            {/* Skills */}
            {Object.keys(skillsByCategory).length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>EXPERTISE</Text>
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <View key={category} style={styles.skillCategory}>
                    <Text style={styles.skillCategoryTitle}>{category}</Text>
                    <View style={styles.skillsContainer}>
                      {skills.map((skill, index) => (
                        <Text key={index} style={styles.skillItem}>{skill}</Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Additional Information */}
            {resumeData.additionalSections && resumeData.additionalSections.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>ADDITIONAL</Text>
                {resumeData.additionalSections
                  .filter(section => section.items && section.items.length > 0)
                  .map(section => (
                    <View key={section.id} style={styles.additionalSection}>
                      <Text style={styles.additionalTitle}>{section.title}</Text>
                      {section.items.map((item, index) => (
                        <View key={index} style={styles.additionalItem}>
                          <View style={styles.additionalBullet} />
                          <Text style={styles.additionalText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
              </View>
            )}
          </View>

          {/* Main content */}
          <View style={styles.rightColumn}>
            {/* Experience */}
            {resumeData.experience.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
                {Object.entries(groupExperiencesByCompany(resumeData.experience)).map(([company, experiences]) => (
                  <View key={company} style={styles.experienceItem}>
                    {/* Company Header */}
                    <View style={styles.companyHeader}>
                      <Text style={styles.companyName}>{company}</Text>
                      <Text style={styles.companyLocation}>{experiences[0].location}</Text>
                    </View>
                    
                    {/* Positions within the company */}
                    {experiences.map((exp) => (
                      <View key={exp.id} style={styles.positionContainer}>
                        <View style={styles.positionHeader}>
                          <Text style={styles.positionTitle}>{exp.position}</Text>
                          <Text style={styles.dateRange}>
                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                          </Text>
                        </View>
                        
                        {exp.description && (
                          <Text style={styles.description}>{exp.description}</Text>
                        )}
                        
                        {exp.achievements.length > 0 && (
                          <View style={styles.achievementsList}>
                            {exp.achievements.map((achievement: string, index: number) => (
                              <View key={index} style={styles.achievement}>
                                <View style={styles.bullet} />
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

            {/* Education and Projects */}
            <View style={styles.twoColumnContainer}>
              {/* Education */}
              {resumeData.education.length > 0 && (
                <View style={styles.column}>
                  <Text style={styles.sectionTitle}>EDUCATION</Text>
                  {resumeData.education.map((edu) => (
                    <View key={edu.id} style={styles.educationItem}>
                      <Text style={styles.degree}>{edu.degree}</Text>
                      <Text style={styles.field}>{edu.field}</Text>
                      <Text style={styles.institution}>{edu.institution}</Text>
                      <View style={styles.educationHeader}>
                        <Text style={styles.graduationDate}>{edu.graduationDate}</Text>
                        {edu.gpa && <Text style={styles.gpa}>GPA: {edu.gpa}</Text>}
                      </View>
                      {edu.honors && <Text style={styles.honors}>{edu.honors}</Text>}
                    </View>
                  ))}
                </View>
              )}

              {/* Projects */}
              {resumeData.projects.length > 0 && (
                <View style={styles.column}>
                  <Text style={styles.sectionTitle}>PROJECTS</Text>
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
                          {project.url && `Website: ${project.url}`}
                          {project.url && project.github && ' | '}
                          {project.github && `Repository: ${project.github}`}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
