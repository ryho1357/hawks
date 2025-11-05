// services/contactService.js
import { databases, DATABASE_ID, CONTACT_COLLECTION_ID, ID } from '../config/appwrite';

export const submitContactForm = async (formData) => {
  try {
    const submission = {
      name: formData.name,
      email: formData.email,
      company: formData.company || '',
      projectType: formData.projectType || '',
      budget: formData.budget || '',
      timeline: formData.timeline || '',
      message: formData.message,
      message: formData.phone || '',
      status: 'new'
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      CONTACT_COLLECTION_ID,
      ID.unique(),
      submission
    );

    return { success: true, data: response };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: error.message };
  }
};

// Optional: Function to get all submissions (for admin use)
export const getContactSubmissions = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      CONTACT_COLLECTION_ID
    );
    return { success: true, data: response.documents };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return { success: false, error: error.message };
  }
};