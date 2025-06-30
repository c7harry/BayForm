import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ResumeData } from '../types/resume';
import { generateQRCodeDataURL, getQRCodeURL } from './ModernResumePDF';

// Executive template styles - clean, professional, two-column layout
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  header: {
    position: 'relative',
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#3B82F6',
  },
  gradientLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#3B82F6',
  },
  headerContent: {
    flex: 1,
    paddingRight: 80,
  },
  profileAndQRContainer: {
    position: 'absolute',
    top: 16,
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
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 14,
    color: '#1D4ED8',
    marginBottom: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 10,
    color: '#374151',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 2,
  },
  contactBullet: {
    width: 3,
    height: 3,
    backgroundColor: '#1D4ED8',
    borderRadius: 2,
    marginRight: 6,
  },
  mainContent: {
    flexDirection: 'row',
    gap: 12,
  },
  leftColumn: {
    width: '30%',
  },
  rightColumn: {
    width: '70%',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    borderBottomWidth: 2,
    borderBottomColor: '#1D4ED8',
    paddingBottom: 2,
    marginBottom: 6,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  skillCategory: {
    marginBottom: 6,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1D4ED8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  skillTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  skillTag: {
    backgroundColor: '#F3F4F6',
    color: '#1F2937',
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    fontWeight: 'bold',
  },
  additionalSection: {
    marginBottom: 6,
  },
  additionalTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1D4ED8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  additionalItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  additionalBullet: {
    width: 3,
    height: 3,
    backgroundColor: '#1D4ED8',
    borderRadius: 2,
    marginRight: 6,
    marginTop: 3,
  },
  additionalText: {
    fontSize: 8,
    color: '#374151',
    flex: 1,
  },
  experienceItem: {
    marginBottom: 8,
  },
  companyHeader: {
    marginBottom: 4,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1D4ED8',
    borderLeftWidth: 3,
    borderLeftColor: '#1D4ED8',
    paddingLeft: 8,
  },
  companyLocation: {
    fontSize: 8,
    color: '#6B7280',
    paddingLeft: 8,
    marginTop: 1,
  },
  positionContainer: {
    marginBottom: 4,
    paddingLeft: 16,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  positionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  dateRange: {
    fontSize: 8,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 8,
    color: '#374151',
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
    width: 3,
    height: 3,
    backgroundColor: '#1D4ED8',
    borderRadius: 2,
    marginRight: 6,
    marginTop: 3,
  },
  achievementText: {
    fontSize: 8,
    color: '#374151',
    flex: 1,
  },
  educationItem: {
    marginBottom: 4,
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
  institution: {
    fontSize: 10,
    color: '#1D4ED8',
    fontWeight: 'bold',
  },
  honors: {
    fontSize: 8,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  graduationDate: {
    fontSize: 8,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  gpa: {
    fontSize: 8,
    color: '#6B7280',
  },
  projectItem: {
    marginBottom: 4,
  },
  projectName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 1,
  },
  projectDescription: {
    fontSize: 8,
    color: '#374151',
    marginBottom: 2,
  },
  technologiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  technologyTag: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    fontSize: 7,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginRight: 3,
    marginBottom: 1,
    borderRadius: 2,
    fontWeight: 'bold',
  },
  projectLinks: {
    fontSize: 8,
    color: '#1D4ED8',
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

// Executive Resume PDF Component
export const ExecutiveResumePDF: React.FC<{ 
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
    resumeData.personalInfo.location,
    resumeData.personalInfo.email,
    formatPhoneNumber(resumeData.personalInfo.phone),
    resumeData.personalInfo.website,
    resumeData.personalInfo.linkedIn,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with gradient accent */}
        <View style={styles.header}>
          <View style={styles.gradientLine} />
          
          {/* Profile picture and QR Code container */}
          <View style={styles.profileAndQRContainer}>
            {resumeData.personalInfo.profilePicture && (
              <Image style={styles.profileImage} src={resumeData.personalInfo.profilePicture} />
            )}
            {qrCodeDataURL && (
              <Image style={styles.qrCode} src={qrCodeDataURL} />
            )}
          </View>
          
          <View style={styles.headerContent}>
            <Text style={styles.name}>{resumeData.personalInfo.fullName}</Text>
            {resumeData.personalInfo.professionTitle && (
              <Text style={styles.title}>{resumeData.personalInfo.professionTitle}</Text>
            )}
            <View style={styles.contactInfo}>
              {contactItems.map((item, index) => (
                <View key={index} style={styles.contactItem}>
                  <View style={styles.contactBullet} />
                  <Text>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Two-column layout */}
        <View style={styles.mainContent}>
          {/* Left column - Skills and Additional Info */}
          <View style={styles.leftColumn}>
            {/* Skills Section */}
            {Object.keys(skillsByCategory).length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>SKILLS</Text>
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <View key={category} style={styles.skillCategory}>
                    <Text style={styles.skillCategoryTitle}>{category}</Text>
                    <View style={styles.skillTagsContainer}>
                      {skills.map((skill, index) => (
                        <Text key={index} style={styles.skillTag}>{skill}</Text>
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

          {/* Right column - Experience, Education, Projects */}
          <View style={styles.rightColumn}>
            {/* Experience Section */}
            {resumeData.experience.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>EXPERIENCE</Text>
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
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
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

            {/* Education Section */}
            {resumeData.education.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>EDUCATION</Text>
                {resumeData.education.map((edu) => (
                  <View key={edu.id} style={styles.educationItem}>
                    <View style={styles.educationHeader}>
                      <View style={styles.educationLeft}>
                        <Text style={styles.degree}>{edu.degree} in {edu.field}</Text>
                        <Text style={styles.institution}>{edu.institution}</Text>
                        {edu.honors && <Text style={styles.honors}>{edu.honors}</Text>}
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

            {/* Projects Section */}
            {resumeData.projects.length > 0 && (
              <View>
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
      </Page>
    </Document>
  );
};
