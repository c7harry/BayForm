import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ResumeData } from '../types/resume';
import { generateQRCodeDataURL, getQRCodeURL } from './ModernResumePDF';

// Tech template styles - modern, geometric, dark header with compact layout
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 8,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#1E293B',
    color: '#ffffff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    position: 'relative',
  },
  headerDecoration1: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    backgroundColor: '#3B82F6',
    borderBottomLeftRadius: 40,
    opacity: 0.2,
  },
  headerDecoration2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 64,
    height: 64,
    backgroundColor: '#10B981',
    borderTopRightRadius: 32,
    opacity: 0.2,
  },
  headerContent: {
    flex: 1,
    paddingRight: 80,
    position: 'relative',
    zIndex: 2,
  },
  profileAndQRContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
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
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 14,
    color: '#93C5FD',
    marginBottom: 4,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 2,
  },
  contactBullet: {
    width: 6,
    height: 6,
    backgroundColor: '#60A5FA',
    borderRadius: 3,
    marginRight: 8,
  },
  contactText: {
    color: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIconSquare: {
    width: 10,
    height: 10,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  sectionIconCircle: {
    width: 10,
    height: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  sectionIconDiamond: {
    width: 8,
    height: 8,
    backgroundColor: '#ffffff',
    transform: 'rotate(45deg)',
  },
  skillsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  skillsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  skillCategoryLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    minWidth: 90,
    textAlign: 'right',
    paddingTop: 2,
  },
  skillTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: 2,
  },
  skillTag: {
    backgroundColor: '#ffffff',
    color: '#475569',
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  experienceContainer: {
    marginBottom: 8,
  },
  experienceItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 8,
  },
  companyHeader: {
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  companyHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  companyBullet: {
    width: 12,
    height: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  companyLocation: {
    fontSize: 10,
    color: '#475569',
    marginTop: 2,
  },
  positionContainer: {
    padding: 6,
    marginBottom: 6,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  positionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  dateRange: {
    fontSize: 8,
    color: '#475569',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 10,
    color: '#475569',
    fontStyle: 'italic',
    marginBottom: 2,
    backgroundColor: '#F8FAFC',
    padding: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  achievementsList: {
    marginTop: 2,
  },
  achievement: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 8,
    height: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
    marginRight: 8,
    marginTop: 2,
  },
  achievementText: {
    fontSize: 10,
    color: '#374151',
    flex: 1,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  column: {
    flex: 1,
  },
  educationItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
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
    color: '#1E293B',
    marginBottom: 1,
  },
  field: {
    fontSize: 8,
    color: '#475569',
  },
  institution: {
    fontSize: 10,
    color: '#059669',
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
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  projectName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 8,
    color: '#475569',
    marginBottom: 2,
  },
  technologiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  technologyTag: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
    fontSize: 7,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginRight: 2,
    marginBottom: 1,
    borderRadius: 4,
    fontWeight: 'bold',
  },
  projectLinks: {
    fontSize: 8,
    color: '#2563EB',
  },
  additionalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  additionalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  additionalSection: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 4,
  },
  additionalTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  additionalItem: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  additionalBullet: {
    width: 6,
    height: 6,
    backgroundColor: '#7C3AED',
    borderRadius: 3,
    marginRight: 6,
    marginTop: 2,
  },
  additionalText: {
    fontSize: 8,
    color: '#475569',
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

// Tech Resume PDF Component
export const TechResumePDF: React.FC<{ 
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
        {/* Header with modern geometric design */}
        <View style={styles.header}>
          {/* Geometric accent elements */}
          <View style={styles.headerDecoration1} />
          <View style={styles.headerDecoration2} />
          
          {/* Profile picture and QR Code container */}
          <View style={styles.profileAndQRContainer}>
            {resumeData.personalInfo.profilePicture && (
              <Image style={styles.profileImage} src={resumeData.personalInfo.profilePicture} alt="Profile picture" />
            )}
            {qrCodeDataURL && (
              <Image style={styles.qrCode} src={qrCodeDataURL} alt="QR Code" />
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
                  <Text style={styles.contactText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Skills with modern card design */}
        {Object.keys(skillsByCategory).length > 0 && (
          <View>
            <View style={styles.sectionTitle}>
              <View style={styles.sectionIcon}>
                <View style={styles.sectionIconSquare} />
              </View>
              <Text>CORE COMPETENCIES</Text>
            </View>
            <View style={styles.skillsContainer}>
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <View key={category} style={styles.skillsRow}>
                  <Text style={styles.skillCategoryLabel}>{category}:</Text>
                  <View style={styles.skillTagsContainer}>
                    {skills.map((skill, index) => (
                      <Text key={index} style={styles.skillTag}>{skill}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Experience with timeline design */}
        {resumeData.experience.length > 0 && (
          <View style={styles.experienceContainer}>
            <View style={styles.sectionTitle}>
              <View style={styles.sectionIcon}>
                <View style={styles.sectionIconCircle} />
              </View>
              <Text>PROFESSIONAL EXPERIENCE</Text>
            </View>
            {Object.entries(groupExperiencesByCompany(resumeData.experience)).map(([company, experiences]) => (
              <View key={company} style={styles.experienceItem}>
                {/* Company Header */}
                <View style={styles.companyHeader}>
                  <View style={styles.companyHeaderContent}>
                    <View style={styles.companyBullet} />
                    <View>
                      <Text style={styles.companyName}>{company}</Text>
                      <Text style={styles.companyLocation}>{experiences[0].location}</Text>
                    </View>
                  </View>
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

        {/* Education and Projects in grid */}
        <View style={styles.twoColumnContainer}>
          {/* Education */}
          {resumeData.education.length > 0 && (
            <View style={styles.column}>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionIcon}>
                  <View style={styles.sectionIconSquare} />
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

          {/* Projects */}
          {resumeData.projects.length > 0 && (
            <View style={styles.column}>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionIcon}>
                  <View style={styles.sectionIconCircle} />
                </View>
                <Text>KEY PROJECTS</Text>
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
                      {project.github && `📂 ${project.github}`}
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
                <View style={styles.sectionIconDiamond} />
              </View>
              <Text>ADDITIONAL INFORMATION</Text>
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
