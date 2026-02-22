'use client';

import { ResumeData } from '../types';

interface ResumeTemplateProps {
  data: ResumeData;
  isEditable?: boolean;
  onChange?: (data: ResumeData) => void;
  className?: string;
}

export default function ResumeTemplate({
  data,
  isEditable = false,
  onChange,
  className = ''
}: ResumeTemplateProps) {
  const handleFieldChange = (
    section: keyof ResumeData,
    value: any
  ) => {
    if (onChange) {
      onChange({ ...data, [section]: value });
    }
  };

  return (
    <div
      className={`resume-template bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-4xl mx-auto ${className}`}
      style={{
        fontFamily: 'Calibri, Arial, sans-serif',
        fontSize: '11pt',
        lineHeight: '1.5'
      }}
    >
      {/* Personal Info */}
      <div className="mb-6 text-center border-b-2 border-gray-800 pb-4">
        <h1
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={(e) =>
            handleFieldChange('personalInfo', {
              ...data.personalInfo,
              name: e.currentTarget.textContent || ''
            })
          }
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          {data.personalInfo.name}
        </h1>
        <div className="text-sm text-gray-700 space-y-1">
          {data.personalInfo.email && (
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleFieldChange('personalInfo', {
                  ...data.personalInfo,
                  email: e.currentTarget.textContent || ''
                })
              }
            >
              📧 {data.personalInfo.email}
            </div>
          )}
          {data.personalInfo.phone && (
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleFieldChange('personalInfo', {
                  ...data.personalInfo,
                  phone: e.currentTarget.textContent || ''
                })
              }
            >
              📱 {data.personalInfo.phone}
            </div>
          )}
          <div className="flex justify-center gap-4 flex-wrap">
            {data.personalInfo.linkedin && (
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleFieldChange('personalInfo', {
                    ...data.personalInfo,
                    linkedin: e.currentTarget.textContent || ''
                  })
                }
                className="text-blue-600"
              >
                🔗 {data.personalInfo.linkedin}
              </span>
            )}
            {data.personalInfo.github && (
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleFieldChange('personalInfo', {
                    ...data.personalInfo,
                    github: e.currentTarget.textContent || ''
                  })
                }
                className="text-blue-600"
              >
                💻 {data.personalInfo.github}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-400 pb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) =>
              handleFieldChange('summary', e.currentTarget.textContent || '')
            }
            className="text-gray-800"
          >
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-400 pb-1">
            EXPERIENCE
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    className="font-bold text-gray-900"
                  >
                    {exp.title}
                  </h3>
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    className="text-sm text-gray-600 italic"
                  >
                    {exp.duration}
                  </span>
                </div>
                <div className="text-gray-700 mb-2">
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    className="font-semibold"
                  >
                    {exp.company}
                  </span>
                  {exp.location && (
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      className="text-sm"
                    >
                      {' '}
                      | {exp.location}
                    </span>
                  )}
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-800">
                  {exp.bullets.map((bullet, bulletIdx) => (
                    <li
                      key={bulletIdx}
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      className="ml-2"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-400 pb-1">
            EDUCATION
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    className="font-bold text-gray-900"
                  >
                    {edu.degree}
                  </h3>
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    className="text-sm text-gray-600"
                  >
                    {edu.year}
                  </span>
                </div>
                <div
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  className="text-gray-700"
                >
                  {edu.school}
                  {edu.location && ` | ${edu.location}`}
                </div>
                {edu.gpa && (
                  <div
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    className="text-sm text-gray-600"
                  >
                    GPA: {edu.gpa}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {Object.keys(data.skills).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-400 pb-1">
            TECHNICAL SKILLS
          </h2>
          <div className="space-y-2">
            {Object.entries(data.skills).map(([category, skillList]) => (
              <div key={category} className="flex">
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  className="font-semibold text-gray-900 min-w-[140px]"
                >
                  {category}:
                </span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  className="text-gray-800"
                >
                  {skillList.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-400 pb-1">
            PROJECTS
          </h2>
          <div className="space-y-3">
            {data.projects.map((project, idx) => (
              <div key={idx}>
                <h3
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  className="font-bold text-gray-900"
                >
                  {project.name}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm ml-2"
                    >
                      🔗
                    </a>
                  )}
                </h3>
                <p
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  className="text-gray-800 mb-1"
                >
                  {project.description}
                </p>
                <div
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  className="text-sm text-gray-600"
                >
                  <span className="font-semibold">Technologies:</span>{' '}
                  {project.technologies.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-400 pb-1">
            CERTIFICATIONS
          </h2>
          <div className="space-y-2">
            {data.certifications.map((cert, idx) => (
              <div key={idx} className="flex justify-between">
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  className="text-gray-800"
                >
                  <span className="font-semibold">{cert.name}</span> - {cert.issuer}
                </span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  className="text-sm text-gray-600"
                >
                  {cert.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          .resume-template {
            box-shadow: none;
            padding: 0.5in;
            max-width: 100%;
          }
          @page {
            size: A4;
            margin: 0.5in;
          }
        }
      `}</style>
    </div>
  );
}
