import React, { useEffect, useState } from 'react';
import { Award, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CertificateCard from '../components/CertificateCard';

function Certificates() {
  const { certificates, getUserCertificates, generateCertificate } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        await getUserCertificates();
      } catch (error) {
        console.error('Failed to load certificates:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCertificates();
  }, []);

  const handleDownloadCertificate = (courseTitle) => {
    alert(`Downloading certificate for "${courseTitle}"`);
  };

  const handleGenerateCertificate = async (courseId) => {
    try {
      await generateCertificate(courseId);
    } catch (error) {
      console.error('Failed to generate certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
            <Award className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
            <p className="text-gray-600">Your achievements and completed course certificates</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Certificates Earned</h3>
              <p className="text-3xl font-bold text-blue-600 mt-1">{certificates.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Keep learning to earn more!</p>
              <div className="flex items-center space-x-1 mt-1">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Verified by LearnHub</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(certificate => (
            <CertificateCard
              key={certificate.id}
              course={certificate.course}
              completedDate={certificate.issuedAt}
              onDownload={() => handleDownloadCertificate(certificate.course.title)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Award className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Complete your enrolled courses to earn certificates and showcase your achievements.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/enrolled-courses'}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <span>View Enrolled Courses</span>
            </button>
            <div className="text-sm text-gray-500">
              or{' '}
              <button
                onClick={() => window.location.href = '/courses'}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                browse new courses
              </button>
            </div>
          </div>
        </div>
      )}
      {certificates.length > 0 && (
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">About Your Certificates</h4>
              <ul className="space-y-1">
                <li>• All certificates are digitally verified</li>
                <li>• Certificates include completion date and course details</li>
                <li>• Download certificates as PDF for sharing</li>
                <li>• Certificates are permanently stored in your account</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Sharing Your Achievements</h4>
              <ul className="space-y-1">
                <li>• Add certificates to your LinkedIn profile</li>
                <li>• Include in your resume and portfolio</li>
                <li>• Share with employers and colleagues</li>
                <li>• Use as proof of professional development</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Certificates; 