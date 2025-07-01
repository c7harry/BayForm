import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ResumeData } from '../types/resume';
import { generateQRCodeDataURL, getQRCodeURL } from './ModernResumePDF';

// Creative template styles - colorful, modern, with gradients and creative elements
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  header: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 96,
    height: 96,
    backgroundColor: '#F3E8FF',
    borderRadius: 48,
    opacity: 0.1,
  },
  headerContent: {
    flex: 1,
    paddingRight: 80,
    position: 'relative',
    zIndex: 2,
  },
  profileAndQRContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 3,
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
    color: '#7C3AED',
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#6B7280',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 2,
  },
  contactIcon: {
    fontSize: 8,
    marginRight: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIconText: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  skillsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillCategory: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 8,
  },
  skillCategoryTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#7C3AED',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD6FE',
    paddingBottom: 2,
  },
  skillTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  skillTag: {
    backgroundColor: '#F3E8FF',
    color: '#7C3AED',
    fontSize: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  experienceContainer: {
    marginBottom: 16,
  },
  experienceItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  companyHeader: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyBullet: {
    width: 6,
    height: 6,
    backgroundColor: '#7C3AED',
    borderRadius: 3,
    marginRight: 8,
  },
  companyLocation: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 2,
  },
  positionContainer: {
    marginBottom: 8,
    paddingLeft: 16,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  positionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  dateRange: {
    fontSize: 8,
    color: '#6B7280',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 9,
    color: '#374151',
    fontStyle: 'italic',
    marginBottom: 4,
    backgroundColor: '#F8FAFC',
    padding: 6,
    borderRadius: 4,
  },
  achievementsList: {
    marginTop: 2,
  },
  achievement: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 4,
    height: 4,
    backgroundColor: '#7C3AED',
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
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
  educationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
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
    fontSize: 10,
    color: '#10B981',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  projectName: {
    fontSize: 9,
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
    backgroundColor: '#FEF3C7',
    color: '#D97706',
    fontSize: 7,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginRight: 3,
    marginBottom: 1,
    borderRadius: 8,
  },
  projectLinks: {
    fontSize: 8,
    color: '#2563EB',
  },
  additionalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  additionalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  additionalSection: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 8,
  },
  additionalTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6366F1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  additionalItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  additionalBullet: {
    width: 3,
    height: 3,
    backgroundColor: '#6366F1',
    borderRadius: 2,
    marginRight: 6,
    marginTop: 3,
  },
  additionalText: {
    fontSize: 8,
    color: '#374151',
    flex: 1,
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

// Creative Resume PDF Component
export const CreativeResumePDF: React.FC<{ 
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
    { icon: '📍', text: resumeData.personalInfo.location },
    { icon: '✉️', text: resumeData.personalInfo.email },
    { icon: '📞', text: formatPhoneNumber(resumeData.personalInfo.phone) },
    { icon: '🌐', text: resumeData.personalInfo.website },
    { icon: '💼', text: resumeData.personalInfo.linkedIn },
  ].filter(item => item.text);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with geometric design */}
        <View style={styles.header}>
          <View style={styles.headerDecoration} />
          
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
                  <Text style={styles.contactIcon}>{item.icon}</Text>
                  <Text>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Skills with creative design */}
        {Object.keys(skillsByCategory).length > 0 && (
          <View>
            <View style={styles.sectionTitle}>
              <View style={styles.sectionIcon}>
                <Text style={styles.sectionIconText}>💡</Text>
              </View>
              <Text>SKILLS</Text>
            </View>
            <View style={styles.skillsContainer}>
              <View style={styles.skillsGrid}>
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
            </View>
          </View>
        )}

        {/* Experience Section */}
        {resumeData.experience.length > 0 && (
          <View style={styles.experienceContainer}>
            <View style={styles.sectionTitle}>
              <View style={styles.sectionIcon}>
                <Text style={styles.sectionIconText}>💼</Text>
              </View>
              <Text>EXPERIENCE</Text>
            </View>
            {Object.entries(groupExperiencesByCompany(resumeData.experience)).map(([company, experiences]) => (
              <View key={company} style={styles.experienceItem}>
                {/* Company Header */}
                <View style={styles.companyHeader}>
                  <View style={styles.companyName}>
                    <View style={styles.companyBullet} />
                    <Text>{company}</Text>
                  </View>
                  <Text style={styles.companyLocation}>{experiences[0].location}</Text>
                </View>
                
                {/* Positions within the company */}
                {experiences.map((exp) => (
                  <View key={exp.id} style={styles.positionContainer}>
                    <View style={styles.positionHeader}>
                      <Text style={styles.positionTitle}>{exp.position}</Text>
                      <Text style={styles.dateRange}>
                        {exp.startDate} → {exp.current ? 'Present' : exp.endDate}
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

        {/* Education and Projects in two columns */}
        <View style={styles.twoColumnContainer}>
          {/* Education Section */}
          {resumeData.education.length > 0 && (
            <View style={styles.column}>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionIcon}>
                  <Text style={styles.sectionIconText}>🎓</Text>
                </View>
                <Text>EDUCATION</Text>
              </View>
              {resumeData.education.map((edu) => (
                <View key={edu.id} style={styles.educationItem}>
                  <View style={styles.educationHeader}>
                    <View style={styles.educationLeft}>
                      <Text style={styles.degree}>{edu.degree}</Text>
                      <Text style={styles.field}>{edu.field}</Text>
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
            <View style={styles.column}>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionIcon}>
                  <Text style={styles.sectionIconText}>🚀</Text>
                </View>
                <Text>PROJECTS</Text>
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
                      {project.url && `🌐 ${project.url}`}
                      {project.url && project.github && ' | '}
                      {project.github && `📱 ${project.github}`}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Additional Information */}
        {resumeData.additionalSections && resumeData.additionalSections.length > 0 && (
          <View>
            <View style={styles.sectionTitle}>
              <View style={styles.sectionIcon}>
                <Text style={styles.sectionIconText}>✨</Text>
              </View>
              <Text>ADDITIONAL INFO</Text>
            </View>
            <View style={styles.additionalContainer}>
              <View style={styles.additionalGrid}>
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
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
