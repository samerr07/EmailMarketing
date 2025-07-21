
// import { useState, useRef, useEffect } from 'react';
// import { X, Upload, Mail, Settings, Send, FileText, CheckCircle, AlertCircle, Clock, Plus, Eye, Image as ImageIcon } from 'lucide-react';
// import { BASEURL } from '../utility/config';

// export default function EmailMarketingTool() {
//     const [activeStep, setActiveStep] = useState(1);
//     const [excelFile, setExcelFile] = useState(null);
//     const [excelFileName, setExcelFileName] = useState('');
//     const [templateFile, setTemplateFile] = useState(null);
//     const [templateFileName, setTemplateFileName] = useState('');
//     const [templateContent, setTemplateContent] = useState('');
//     const [activeTemplateTab, setActiveTemplateTab] = useState('upload');
//     const [excelProgress, setExcelProgress] = useState(0);
//     const [templateProgress, setTemplateProgress] = useState(0);
//     const [uploadExcelDisabled, setUploadExcelDisabled] = useState(true);
//     const [uploadTemplateDisabled, setUploadTemplateDisabled] = useState(true);
//     const [nextToStep2Disabled, setNextToStep2Disabled] = useState(true);
//     const [nextToStep3Disabled, setNextToStep3Disabled] = useState(true);
//     const [excelPreview, setExcelPreview] = useState(null);
//     const [templatePreview, setTemplatePreview] = useState(null);
//     // const [recipientCount, setRecipientCount] = useState(0);

//     // Excel data state
//     const [excelData, setExcelData] = useState(null);
//     const [totalRows, setTotalRows] = useState(0);
//     const [excelFilePath, setExcelFilePath] = useState('');
//     const [templateFilePath, setTemplateFilePath] = useState('');

//     // SMTP Settings
//     const [smtpServer, setSmtpServer] = useState('');
//     const [smtpPort, setSmtpPort] = useState('587');
//     const [emailUser, setEmailUser] = useState('');
//     const [emailPass, setEmailPass] = useState('');
//     const [senderName, setSenderName] = useState('');
//     const [connectionStatus, setConnectionStatus] = useState('');
//     const [testingConnection, setTestingConnection] = useState(false);

//     // Email Configuration
//     const [emailColumns, setEmailColumns] = useState([]);
//     const [selectedEmailColumn, setSelectedEmailColumn] = useState('');
//     const [selectedNameColumn, setSelectedNameColumn] = useState('');
//     const [subjectLine, setSubjectLine] = useState('');

//     // Variable mappings
//     const [variableMappings, setVariableMappings] = useState([]);
//     const [emailPreviewContent, setEmailPreviewContent] = useState('');

//     // Sending data
//     const [recipientCount, setRecipientCount] = useState(0);
//     const [isSending, setIsSending] = useState(false);
//     const [sendingComplete, setSendingComplete] = useState(false);
//     const [sentCount, setSentCount] = useState(0);
//     const [failedCount, setFailedCount] = useState(0);
//     const [remainingCount, setRemainingCount] = useState(0);
//     const [sendingProgress, setSendingProgress] = useState(0);
//     const [sendingLogs, setSendingLogs] = useState([]);
//     const [delayBetweenEmails, setDelayBetweenEmails] = useState(2000);
//     const [currentJobId, setCurrentJobId] = useState(null);
//     const [statusInterval, setStatusInterval] = useState(null);
//     const [campaignName, setCampaignName] = useState('');

//     // New image-related state
//     const [uploadedImages, setUploadedImages] = useState([]);
//     const [imageProgress, setImageProgress] = useState({});
//     const [showImageManager, setShowImageManager] = useState(false);
//     const [draggedImage, setDraggedImage] = useState(null);
//     const [excelPublicId, setExcelPublicId] = useState('');

//     // File input refs
//     const excelFileRef = useRef(null);
//     const templateFileRef = useRef(null);
//     const imageFileRef = useRef(null);



//     // Handle Excel file selection
//     const handleExcelFileChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
//             alert('Please select a valid Excel file (.xlsx or .xls)');
//             e.target.value = '';
//             setExcelFileName('');
//             return;
//         }

//         setExcelFile(file);
//         setExcelFileName(file.name);
//         setUploadExcelDisabled(false);
//     };

//     // Handle template file selection
//     const handleTemplateFileChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
//             alert('Please select a valid HTML file (.html or .htm)');
//             e.target.value = '';
//             setTemplateFileName('');
//             return;
//         }

//         setTemplateFile(file);
//         setTemplateFileName(file.name);
//         setUploadTemplateDisabled(false);
//     };

//     // Handle image file selection
//     const handleImageFileChange = (e) => {
//         const files = Array.from(e.target.files);

//         files.forEach(file => {
//             if (!file.type.startsWith('image/')) {
//                 alert(`${file.name} is not a valid image file`);
//                 return;
//             }

//             // Check file size (limit to 5MB)
//             if (file.size > 5 * 1024 * 1024) {
//                 alert(`${file.name} is too large. Please choose an image under 5MB.`);
//                 return;
//             }

//             uploadImage(file);
//         });

//         // Reset file input
//         e.target.value = '';
//     };

    

//     const removeImage = (imageId) => {
//         setUploadedImages(prev => prev.filter(img => img.id !== imageId));
//         setImageProgress(prev => {
//             const newProgress = { ...prev };
//             delete newProgress[imageId];
//             return newProgress;
//         });
//     };

//     const uploadImage = async (file) => {
//         const imageId = Date.now() + Math.random();

//         // Convert file to base64
//         const base64 = await new Promise((resolve) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result);
//             reader.readAsDataURL(file);
//         });

//         // Add image to state with loading status
//         const newImage = {
//             id: imageId,
//             name: file.name,
//             file: file,
//             url: null,
//             base64: base64, // Store base64 data
//             uploading: true,
//             progress: 0,
//             cidName: null
//         };

//         setUploadedImages(prev => [...prev, newImage]);

//         const formData = new FormData();
//         formData.append('image', file);

//         try {
//             // Simulate progress
//             let progress = 0;
//             const interval = setInterval(() => {
//                 progress += 20;
//                 setImageProgress(prev => ({
//                     ...prev,
//                     [imageId]: progress
//                 }));
//                 if (progress >= 80) {
//                     clearInterval(interval);
//                 }
//             }, 200);

//             const response = await fetch(`${BASEURL}/upload-image`, {
//                 method: 'POST',
//                 body: formData
//             });

//             const result = await response.json();

//             console.log(result)

//             if (result.success) {
//                 // Complete progress
//                 setImageProgress(prev => ({
//                     ...prev,
//                     [imageId]: 100
//                 }));

//                 // Update image with URL (keep base64 for email use)
//                 // setUploadedImages(prev =>
//                 //     prev.map(img =>
//                 //         img.id === imageId
//                 //             ? { ...img, url: result.imageUrl, uploading: false }
//                 //             : img
//                 //     )
//                 // );
//                 // Update image with URL and CID info
//                 setUploadedImages(prev =>
//                     prev.map(img =>
//                         img.id === imageId
//                             ? {
//                                 ...img,
//                                 url: result.imageUrl,
//                                 uploading: false,
//                                 filename: result.filename,
//                                 cidName: result.cidName || result.filename.split('.')[0]
//                             }
//                             : img
//                     )
//                 );
//             } else {
//                 throw new Error(result.message || 'Failed to upload image');
//             }
//         } catch (error) {
//             alert('Error uploading image: ' + error.message);
//             // Remove failed image
//             setUploadedImages(prev => prev.filter(img => img.id !== imageId));
//             setImageProgress(prev => {
//                 const newProgress = { ...prev };
//                 delete newProgress[imageId];
//                 return newProgress;
//             });
//         }
//     };

//     // Update insertImageIntoTemplate to use base64 for emails
//     const insertImageIntoTemplate = (imageUrl, imageName, base64Data, cidName) => {
//         console.log("Inserting image with CID:", cidName);

//         // Use CID reference for email compatibility
//         // The actual filename will be used as CID by the backend
//         // const imageTag = `<img src="cid:${cidName}" alt="${imageName}" style="max-width: 100%; height: auto;" />`;
//         const imageTag = `<img src="${imageUrl}" alt="${imageName}" style="max-width: 100%; height: auto;" />`;

//         if (activeTemplateTab === 'paste') {
//             const textarea = document.getElementById('template-content');
//             const start = textarea.selectionStart;
//             const end = textarea.selectionEnd;
//             const text = templateContent;
//             const before = text.substring(0, start);
//             const after = text.substring(end, text.length);

//             setTemplateContent(before + imageTag + after);

//             // Set cursor position after inserted image
//             setTimeout(() => {
//                 textarea.selectionStart = textarea.selectionEnd = start + imageTag.length;
//                 textarea.focus();
//             }, 0);
//         }
//     };


//     // Handle tab switching
//     const handleTemplateTabClick = (tab) => {
//         setActiveTemplateTab(tab);
//     };

//     // Upload Excel file to backend
//     const uploadExcel = async () => {
//         if (!excelFile) return;

//         const formData = new FormData();
//         formData.append('excel', excelFile);

//         try {
//             // Animate progress
//             let progress = 0;
//             const interval = setInterval(() => {
//                 progress += 20;
//                 setExcelProgress(progress);
//                 if (progress >= 80) {
//                     clearInterval(interval);
//                 }
//             }, 100);

//             const response = await fetch(`${BASEURL}/preview-excel`, {
//                 method: 'POST',
//                 body: formData
//             });

//             const result = await response.json();

//             console.log(result)

//             if (result.success) {
//                 // Complete progress
//                 setExcelProgress(100);

//                 // Store data
//                 setExcelData(result);
//                 setTotalRows(result.totalRows);
//                 setRecipientCount(result.totalRows);
//                 setExcelFilePath(result.cloudinaryUrl);
//                 setExcelPublicId(result.cloudinaryPublicId)

//                 // Set preview
//                 setExcelPreview({
//                     headers: result.headers,
//                     data: result.sample.map(obj => result.headers.map(header => obj[header] || ''))
//                 });

//                 // Set available columns
//                 setEmailColumns(result.headers);

//                 // Auto-detect email column
//                 const emailCol = result.headers.find(header =>
//                     header.toLowerCase().includes('email') || header.toLowerCase().includes('mail')
//                 );
//                 if (emailCol) {
//                     setSelectedEmailColumn(emailCol);
//                 }

//                 // Auto-detect name column
//                 const nameCol = result.headers.find(header =>
//                     header.toLowerCase().includes('name') || header.toLowerCase().includes('first')
//                 );
//                 if (nameCol) {
//                     setSelectedNameColumn(nameCol);
//                 }

//                 checkStep1Complete();
//             } else {
//                 throw new Error(result.message || 'Failed to process Excel file');
//             }
//         } catch (error) {
//             alert('Error uploading Excel file: ' + error.message);
//             setExcelProgress(0);
//         }
//     };

//     // Upload template file to backend
//     const uploadTemplate = async () => {
//         if (!templateFile) return;

//         const formData = new FormData();
//         formData.append('template', templateFile);

//         try {
//             // Animate progress
//             let progress = 0;
//             const interval = setInterval(() => {
//                 progress += 20;
//                 setTemplateProgress(progress);
//                 if (progress >= 80) {
//                     clearInterval(interval);
//                 }
//             }, 100);

//             const response = await fetch(`${BASEURL}/upload-template`, {
//                 method: 'POST',
//                 body: formData
//             });

//             const result = await response.json();

//             if (result.success) {
//                 // Complete progress
//                 setTemplateProgress(100);

//                 setTemplateContent(result.template);
//                 setTemplateFilePath(result.filePath);
//                 setTemplatePreview('Template uploaded and ready to use.');

//                 checkStep1Complete();
//             } else {
//                 throw new Error(result.message || 'Failed to upload template');
//             }
//         } catch (error) {
//             alert('Error uploading template file: ' + error.message);
//             setTemplateProgress(0);
//         }
//     };

//     // Save template content
//     const saveTemplate = () => {
//         if (templateContent.trim()) {
//             setTemplatePreview('Template content saved and ready to use.');
//             checkStep1Complete();
//         } else {
//             alert('Please enter HTML template content');
//         }
//     };

//     // Check if step 1 is complete
//     const checkStep1Complete = () => {
//         if (excelPreview && (templatePreview || templateContent)) {
//             setNextToStep2Disabled(false);
//         }
//     };

//     // Test SMTP connection with backend
//     const testConnection = async () => {
//         if (!smtpServer || !emailUser || !emailPass) {
//             alert('Please fill in all SMTP fields');
//             return;
//         }

//         setTestingConnection(true);
//         setConnectionStatus('');

//         try {
//             const response = await fetch(`${BASEURL}/test-connection`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     smtpServer,
//                     smtpPort,
//                     emailUser,
//                     emailPass
//                 })
//             });

//             const result = await response.json();

//             if (result.success) {
//                 setConnectionStatus('success');
//             } else {
//                 setConnectionStatus('failed');
//                 alert('Connection failed: ' + result.message);
//             }
//         } catch (error) {
//             setConnectionStatus('failed');
//             alert('Connection test failed: ' + error.message);
//         } finally {
//             setTestingConnection(false);
//             validateStep2();
//         }
//     };

//     // Validate step 2
//     const validateStep2 = () => {
//         const isValid = selectedEmailColumn && subjectLine &&
//             smtpServer && smtpPort &&
//             emailUser && emailPass &&
//             connectionStatus === 'success';

//         setNextToStep3Disabled(!isValid);
//     };

//     // Add variable mapping
//     const addVariableMapping = () => {
//         setVariableMappings([
//             ...variableMappings,
//             { placeholder: '', column: '' }
//         ]);
//     };

//     // Update variable mapping
//     const updateVariableMapping = (index, field, value) => {
//         const newMappings = [...variableMappings];
//         newMappings[index][field] = value;
//         setVariableMappings(newMappings);
//         updateEmailPreview(newMappings);
//     };

//     // Remove variable mapping
//     const removeVariableMapping = (index) => {
//         const newMappings = [...variableMappings];
//         newMappings.splice(index, 1);
//         setVariableMappings(newMappings);
//         updateEmailPreview(newMappings);
//     };

//     // Update email preview
//     const updateEmailPreview = (mappings = variableMappings) => {
//         if (!templateContent || !excelData || !excelData.sample || excelData.sample.length === 0) {
//             setEmailPreviewContent('Preview will appear here once template and data are ready');
//             return;
//         }

//         // Use first sample record
//         const sampleData = excelData.sample[0];
//         let preview = templateContent;

//         // Replace variables
//         mappings.forEach(mapping => {
//             if (mapping.placeholder && mapping.column && sampleData[mapping.column]) {
//                 const regex = new RegExp(`{{${mapping.placeholder}}}`, 'g');
//                 preview = preview.replace(regex, sampleData[mapping.column]);
//             }
//         });

//         // Replace common placeholders
//         if (selectedNameColumn && sampleData[selectedNameColumn]) {
//             preview = preview.replace(/{{name}}/g, sampleData[selectedNameColumn]);
//         }

//         setEmailPreviewContent(preview);
//     };

    

//     const startSending = async () => {
//     try {
//         // Create FormData object
//         const formData = new FormData();

//         // Since excelFilePath now contains Cloudinary URL, send it as a regular field
//         // Don't append the file, send the Cloudinary URL and public ID instead
//         formData.append('excelCloudinaryUrl', excelFilePath); // Cloudinary URL
//         formData.append('excelPublicId', excelPublicId); // Cloudinary public ID

//         // If using template file, send Cloudinary info; otherwise, send template content as text
//         if (templateFile && templateFilePath) {
//             formData.append('templateCloudinaryUrl', templateFilePath); // Cloudinary URL
//             formData.append('templatePublicId', templatePublicId); // Cloudinary public ID
//         }

//         // Append all other data as form fields
//         formData.append('templateContent', templateContent); // Send template content separately
//         formData.append('emailColumn', selectedEmailColumn);
//         formData.append('nameColumn', selectedNameColumn);
//         formData.append('subjectLine', subjectLine);
//         formData.append('smtpServer', smtpServer);
//         formData.append('smtpPort', smtpPort);
//         formData.append('emailUser', emailUser);
//         formData.append('emailPass', emailPass);
//         formData.append('senderName', senderName);
//         formData.append('campaign_name', campaignName);
//         formData.append('delayBetweenEmails', delayBetweenEmails);

//         // Handle variableMappings object - convert to JSON string
//         formData.append('variables', JSON.stringify(variableMappings));

//         const response = await fetch(`${BASEURL}/campaign`, {
//             method: 'POST',
//             body: formData
//         });

//         const result = await response.json();

//         if (result.success) {
//             setCurrentJobId(result.jobId);
//             setIsSending(true);
//             setSendingComplete(false);
//             setSentCount(0);
//             setFailedCount(0);
//             setRemainingCount(result.total);
//             setSendingProgress(0);
//             setSendingLogs([]);

//             // Start polling for status
//             const interval = setInterval(() => {
//                 checkSendingStatus(result.jobId);
//             }, 2000);

//             setStatusInterval(interval);
//         } else {
//             throw new Error(result.message || 'Failed to start sending');
//         }
//     } catch (error) {
//         console.error('Campaign start error:', error);
//         alert('Error starting email send: ' + error.message);
//     }
// };



//     // Check sending status
//     const checkSendingStatus = async (jobId) => {
//         try {
//             const response = await fetch(`${BASEURL}/send-status/${jobId}`);
//             const result = await response.json();

//             if (result.success) {
//                 setSentCount(result.sent);
//                 setFailedCount(result.failed);
//                 setRemainingCount(result.total - (result.sent + result.failed));

//                 const progress = ((result.sent + result.failed) / result.total) * 100;
//                 setSendingProgress(progress);

//                 // Add logs
//                 if (result.sent > sentCount) {
//                     setSendingLogs(prev => [
//                         {
//                             id: Date.now(),
//                             time: new Date().toLocaleTimeString(),
//                             message: `Successfully sent ${result.sent - sentCount} more emails`,
//                             type: 'success'
//                         },
//                         ...prev.slice(0, 49)
//                     ]);
//                 }

//                 if (result.failed > failedCount) {
//                     setSendingLogs(prev => [
//                         {
//                             id: Date.now() + 1,
//                             time: new Date().toLocaleTimeString(),
//                             message: `${result.failed - failedCount} emails failed to send`,
//                             type: 'error'
//                         },
//                         ...prev.slice(0, 49)
//                     ]);
//                 }

//                 if (result.completed || result.stopped) {
//                     setIsSending(false);
//                     setSendingComplete(true);

//                     if (statusInterval) {
//                         clearInterval(statusInterval);
//                         setStatusInterval(null);
//                     }

//                     setSendingLogs(prev => [
//                         {
//                             id: Date.now() + 2,
//                             time: new Date().toLocaleTimeString(),
//                             message: result.stopped ? 'Sending stopped by user' : 'Sending completed',
//                             type: 'info'
//                         },
//                         ...prev.slice(0, 49)
//                     ]);
//                 }
//             }
//         } catch (error) {
//             console.error('Error checking status:', error);
//         }
//     };

//     // Stop sending emails
//     const stopSending = async () => {
//         if (!currentJobId) return;

//         try {
//             const response = await fetch(`${BASEURL}/stop-sending`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     jobId: currentJobId
//                 })
//             });

//             const result = await response.json();

//             if (result.success) {
//                 setSendingLogs(prev => [
//                     {
//                         id: Date.now(),
//                         time: new Date().toLocaleTimeString(),
//                         message: 'Stop request sent. Sending will stop after current email.',
//                         type: 'info'
//                     },
//                     ...prev.slice(0, 49)
//                 ]);
//             }
//         } catch (error) {
//             console.error('Error stopping send:', error);
//         }
//     };

//     // Reset the whole process
//     const startOver = () => {
//         // Clear any active intervals
//         if (statusInterval) {
//             clearInterval(statusInterval);
//             setStatusInterval(null);
//         }

//         setActiveStep(1);
//         setExcelFile(null);
//         setExcelFileName('');
//         setTemplateFile(null);
//         setTemplateFileName('');
//         setTemplateContent('');
//         setExcelProgress(0);
//         setTemplateProgress(0);
//         setUploadExcelDisabled(true);
//         setUploadTemplateDisabled(true);
//         setNextToStep2Disabled(true);
//         setNextToStep3Disabled(true);
//         setExcelPreview(null);
//         setTemplatePreview(null);
//         setVariableMappings([]);
//         setSendingComplete(false);
//         setSendingLogs([]);
//         setConnectionStatus('');
//         setEmailColumns([]);
//         setSelectedEmailColumn('');
//         setSelectedNameColumn('');
//         setSubjectLine('');
//         setSmtpServer('');
//         setEmailUser('');
//         setEmailPass('');
//         setSenderName('');
//         setExcelData(null);
//         setTotalRows(0);
//         setRecipientCount(0);
//         setCurrentJobId(null);
//         setIsSending(false);
//         setSentCount(0);
//         setFailedCount(0);
//         setRemainingCount(0);
//         setSendingProgress(0);

//         // Reset file inputs
//         if (excelFileRef.current) excelFileRef.current.value = '';
//         if (templateFileRef.current) templateFileRef.current.value = '';
//     };

//     // Navigation functions
//     const goToStep = (step) => {
//         setActiveStep(step);
//     };

//     // Watch for changes to validate steps
//     useEffect(() => {
//         validateStep2();
//     }, [selectedEmailColumn, subjectLine, smtpServer, smtpPort, emailUser, emailPass, connectionStatus]);

//     // Initialize with a variable mapping and update preview
//     useEffect(() => {
//         if (variableMappings.length === 0) {
//             addVariableMapping();
//         }
//     }, []);

//     useEffect(() => {
//         updateEmailPreview();
//     }, [templateContent, excelData, variableMappings, selectedNameColumn]);

//     // Cleanup on unmount
//     useEffect(() => {
//         return () => {
//             if (statusInterval) {
//                 clearInterval(statusInterval);
//             }
//         };
//     }, [statusInterval]);

//     return (
       
//         <div className="p-6 space-y-8">
//             <div>
//                 <h2 className="text-3xl font-bold text-gray-900">Compose Campaign</h2>
//                 <p className="text-gray-500 mt-1">Create a new email marketing campaign</p>
//             </div>
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200/50">
//           <h3 className="text-xl font-bold text-gray-900">Campaign Builder</h3>
//           <p className="text-sm text-gray-500 mt-1">Design and configure your email campaign</p>
//         </div>

//             <div className="mb-8 relative">
//                 <ul className="flex justify-between">
//                     <li
//                         className={`relative pt-10 px-4 text-center font-semibold flex-1 z-10 cursor-pointer ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}
//                         onClick={() => activeStep > 1 && goToStep(1)}
//                     >
//                         <span className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white ${activeStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>
//                             <Upload size={16} />
//                         </span>
//                         1. Upload Files
//                     </li>
//                     <li
//                         className={`relative pt-10 px-4 text-center font-semibold flex-1 z-10 cursor-pointer ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}
//                         onClick={() => activeStep > 2 && goToStep(2)}
//                     >
//                         <span className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>
//                             <Settings size={16} />
//                         </span>
//                         2. Configure
//                     </li>
//                     <li
//                         className={`relative pt-10 px-4 text-center font-semibold flex-1 z-10 cursor-pointer ${activeStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}
//                         onClick={() => activeStep > 3 && goToStep(3)}
//                     >
//                         <span className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white ${activeStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}>
//                             <FileText size={16} />
//                         </span>
//                         3. Personalize
//                     </li>
//                     <li
//                         className={`relative pt-10 px-4 text-center font-semibold flex-1 z-10 ${activeStep >= 4 ? 'text-blue-600' : 'text-gray-500'}`}
//                     >
//                         <span className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white ${activeStep >= 4 ? 'bg-blue-600' : 'bg-gray-300'}`}>
//                             <Send size={16} />
//                         </span>
//                         4. Send
//                     </li>
//                 </ul>
//                 <div className="absolute top-8 left-0 w-full h-1 bg-gray-300 z-0"></div>
//             </div>

           

//             <div className={`${activeStep === 1 ? 'block' : 'hidden'}`}>
//                 <div className="bg-white rounded-lg shadow-md p-8 mb-8">
//                     <h2 className="text-2xl text-blue-600 mb-5">Upload Your Data</h2>

//                     {/* Excel File Section */}
//                     <div className="mb-8 pb-5 border-b border-gray-200">
//                         <h3 className="text-xl text-gray-800 mb-3">Excel File with Contacts</h3>
//                         <div className="relative mb-4">
//                             <input
//                                 ref={excelFileRef}
//                                 type="file"
//                                 id="excel-file"
//                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                                 accept=".xlsx, .xls"
//                                 onChange={handleExcelFileChange}
//                             />
//                             <label
//                                 htmlFor="excel-file"
//                                 className="flex items-center p-3 bg-gray-100 border border-dashed border-gray-300 rounded-md cursor-pointer transition-all hover:bg-gray-200"
//                             >
//                                 <span className="text-2xl mr-3">📊</span>
//                                 <span>Choose Excel File</span>
//                             </label>
//                             {excelFileName && <span className="block mt-2 text-sm text-blue-600">{excelFileName}</span>}
//                         </div>
//                         <p className="text-sm text-gray-500 mb-3">Upload an Excel file containing your contact list</p>

//                         <div className="h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
//                             <div
//                                 className="h-full bg-blue-600 transition-all duration-300"
//                                 style={{ width: `${excelProgress}%` }}
//                             ></div>
//                         </div>

//                         <button
//                             className={`px-5 py-2 rounded-md ${uploadExcelDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//                             disabled={uploadExcelDisabled}
//                             onClick={uploadExcel}
//                         >
//                             Upload Excel
//                         </button>

//                         {excelPreview && (
//                             <div className="mt-5 border border-gray-200 rounded-md p-3 max-h-64 overflow-y-auto">
//                                 <div className="mb-2 text-sm text-gray-600">
//                                     Preview - Total Records: {recipientCount}
//                                 </div>
//                                 <table className="w-full">
//                                     <thead>
//                                         <tr>
//                                             {excelPreview.headers.map((header, index) => (
//                                                 <th key={index} className="p-2 bg-gray-100 text-left text-sm font-medium">{header}</th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {excelPreview.data.map((row, rowIndex) => (
//                                             <tr key={rowIndex}>
//                                                 {row.map((cell, cellIndex) => (
//                                                     <td key={cellIndex} className="p-2 border-b border-gray-100 text-sm">{cell}</td>
//                                                 ))}
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     {/* Email Template Section */}
//                     <div className="mb-8">
//                         <div className="flex items-center justify-between mb-3">
//                             <h3 className="text-xl text-gray-800">Email Template</h3>
//                             <button
//                                 onClick={() => setShowImageManager(!showImageManager)}
//                                 className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//                             >
//                                 <ImageIcon className="w-4 h-4 mr-2" />
//                                 Manage Images
//                             </button>
//                         </div>

//                         {/* Image Manager */}
//                         {showImageManager && (
//                             <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
//                                 <div className="flex items-center justify-between mb-4">
//                                     <h4 className="text-lg font-medium text-gray-800">Image Manager</h4>
//                                     <button
//                                         onClick={() => imageFileRef.current?.click()}
//                                         className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                                     >
//                                         <Plus className="w-4 h-4 mr-2" />
//                                         Add Images
//                                     </button>
//                                 </div>

//                                 <input
//                                     ref={imageFileRef}
//                                     type="file"
//                                     multiple
//                                     accept="image/*"
//                                     className="hidden"
//                                     onChange={handleImageFileChange}
//                                 />

                                
//                                 {uploadedImages.length > 0 ? (
//                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                         {uploadedImages.map((image) => (
//                                             <div key={image.id} className="relative group">
//                                                 <div className="aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden">
//                                                     {image.uploading ? (
//                                                         <div className="w-full h-full flex flex-col items-center justify-center">
//                                                             <Upload className="w-8 h-8 text-gray-400 mb-2" />
//                                                             <div className="w-3/4 bg-gray-200 rounded-full h-2">
//                                                                 <div
//                                                                     className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                                                                     style={{ width: `${imageProgress[image.id] || 0}%` }}
//                                                                 ></div>
//                                                             </div>
//                                                             <span className="text-xs text-gray-500 mt-2">Uploading...</span>
//                                                         </div>
//                                                     ) : (
//                                                         <img
//                                                             src={image.url || image.base64 || URL.createObjectURL(image.file)}
//                                                             alt={image.name}
//                                                             className="w-full h-full object-cover"
//                                                         />
//                                                     )}
//                                                 </div>

//                                                 {/* Remove button */}
//                                                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                                     <button
//                                                         onClick={() => removeImage(image.id)}
//                                                         className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
//                                                         title="Remove image"
//                                                     >
//                                                         <X className="w-3 h-3" />
//                                                     </button>
//                                                 </div>

//                                                 {/* Insert button - only show when not uploading */}
//                                                 {!image.uploading && (
//                                                     <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                                         <button
//                                                             onClick={() => insertImageIntoTemplate(
//                                                                 image.url,
//                                                                 image.filename,
//                                                                 image.base64,
//                                                                 image.cidName || image.filename?.split('.')[0] || image.name.split('.')[0]
//                                                             )}
//                                                             className="w-full px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 shadow-lg"
//                                                             title="Insert as CID reference"
//                                                         >
//                                                             Insert
//                                                         </button>
//                                                     </div>
//                                                 )}

//                                                 {/* Image info */}
//                                                 <div className="mt-2">
//                                                     <div className="text-xs text-gray-600 truncate" title={image.name}>
//                                                         {image.name}
//                                                     </div>

//                                                     {/* Show CID info when available */}
//                                                     {(image.cidName || image.filename) && !image.uploading && (
//                                                         <div className="text-xs text-blue-600 truncate" title={`CID: ${image.cidName || image.filename?.split('.')[0]}`}>
//                                                             CID: {image.cidName || image.filename?.split('.')[0]}
//                                                         </div>
//                                                     )}

//                                                     {/* Upload status */}
//                                                     {image.uploading && (
//                                                         <div className="text-xs text-orange-500">
//                                                             Uploading... {imageProgress[image.id] || 0}%
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <div className="text-center py-8 text-gray-500">
//                                         <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                                         <p>No images uploaded yet</p>
//                                         <p className="text-sm">Click "Add Images" to get started</p>
//                                         <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
//                                             <p className="font-medium">💡 Pro Tip:</p>
//                                             <p>Images will be embedded using CID references for better Gmail compatibility</p>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {/* Template Tabs */}
//                         <div className="flex mb-4">
//                             <button
//                                 className={`flex-1 py-2 border ${activeTemplateTab === 'upload' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 border-gray-300'} rounded-l-md`}
//                                 onClick={() => handleTemplateTabClick('upload')}
//                             >
//                                 Upload HTML
//                             </button>
//                             <button
//                                 className={`flex-1 py-2 border ${activeTemplateTab === 'paste' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 border-gray-300'} rounded-r-md`}
//                                 onClick={() => handleTemplateTabClick('paste')}
//                             >
//                                 Paste HTML
//                             </button>
//                         </div>

//                         {activeTemplateTab === 'upload' ? (
//                             <div>
//                                 <div className="relative mb-4">
//                                     <input
//                                         ref={templateFileRef}
//                                         type="file"
//                                         id="template-file"
//                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                                         accept=".html, .htm"
//                                         onChange={handleTemplateFileChange}
//                                     />
//                                     <label
//                                         htmlFor="template-file"
//                                         className="flex items-center p-3 bg-gray-100 border border-dashed border-gray-300 rounded-md cursor-pointer transition-all hover:bg-gray-200"
//                                     >
//                                         <span className="text-2xl mr-3">📝</span>
//                                         <span>Choose HTML Template</span>
//                                     </label>
//                                     {templateFileName && <span className="block mt-2 text-sm text-blue-600">{templateFileName}</span>}
//                                 </div>

//                                 <div className="h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
//                                     <div
//                                         className="h-full bg-blue-600 transition-all duration-300"
//                                         style={{ width: `${templateProgress}%` }}
//                                     ></div>
//                                 </div>

//                                 <button
//                                     className={`px-5 py-2 rounded-md ${uploadTemplateDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//                                     disabled={uploadTemplateDisabled}
//                                     onClick={uploadTemplate}
//                                 >
//                                     Upload Template
//                                 </button>
//                             </div>
//                         ) : (
//                             <div>
//                                 <textarea
//                                     id="template-content"
//                                     className="w-full h-36 p-3 border border-gray-300 rounded-md mb-3 resize-y"
//                                     placeholder="Paste your HTML template here..."
//                                     value={templateContent}
//                                     onChange={(e) => setTemplateContent(e.target.value)}
//                                 ></textarea>

//                                 <button
//                                     className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
//                                     onClick={saveTemplate}
//                                 >
//                                     Save Template
//                                 </button>
//                             </div>
//                         )}

//                         <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
//                             <p className="text-sm text-blue-800 mb-2">
//                                 <strong>Template Tips:</strong>
//                             </p>
//                             <ul className="text-sm text-blue-700 space-y-1">
//                                 <li>• Use placeholder tags like {"{{name}}"} for dynamic content</li>
//                                 <li>• Upload images using the "Manage Images" button above</li>
//                                 <li>• Click "Insert" on any uploaded image to add it to your template</li>
//                                 <li>• Images are automatically optimized for email delivery</li>
//                             </ul>
//                         </div>

//                         {templatePreview && (
//                             <div className="mt-5 p-4 border border-gray-200 rounded-md min-h-24 bg-green-50 text-green-700">
//                                 {templatePreview}
//                             </div>
//                         )}
//                     </div>

//                     <div className="flex justify-end">
//                         <button
//                             className={`px-5 py-2 rounded-md ${nextToStep2Disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//                             onClick={() => goToStep(2)}
//                         >
//                             Next: Configure
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* step 2 */}

//             <div className={`${activeStep === 2 ? 'block' : 'hidden'}`}>
//                 <div className="bg-white rounded-lg shadow-md p-8 mb-8">
//                     <h2 className="text-2xl text-blue-600 mb-5">Configure Email Settings</h2>
//                     <div className="mb-8">
                        
//                     </div>

//                     <div className="mb-8">
//                         <h3 className="text-xl text-gray-800 mb-3">Email Configuration</h3>

//                         <div className="mb-4">
//                             <label htmlFor="email-column" className="block mb-1 font-medium">Email Column</label>
//                             <select
//                                 id="email-column"
//                                 className="w-full p-2 border border-gray-300 rounded-md"
//                                 value={selectedEmailColumn}
//                                 onChange={(e) => setSelectedEmailColumn(e.target.value)}
//                             >
//                                 <option value="">Select column containing emails</option>
//                                 {emailColumns.map((column, index) => (
//                                     <option key={index} value={column}>{column}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div className="mb-4">
//                             <label htmlFor="name-column" className="block mb-1 font-medium">Name Column (optional)</label>
//                             <select
//                                 id="name-column"
//                                 className="w-full p-2 border border-gray-300 rounded-md"
//                                 value={selectedNameColumn}
//                                 onChange={(e) => setSelectedNameColumn(e.target.value)}
//                             >
//                                 <option value="">Select column containing names</option>
//                                 {emailColumns.map((column, index) => (
//                                     <option key={index} value={column}>{column}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div className="mb-4">
//                             <label htmlFor="subject-line" className="block mb-1 font-medium">Email Subject Line</label>
//                             <input
//                                 type="text"
//                                 id="subject-line"
//                                 className="w-full p-2 border border-gray-300 rounded-md"
//                                 placeholder="Subject of your email"
//                                 value={subjectLine}
//                                 onChange={(e) => setSubjectLine(e.target.value)}
//                             />
//                             <p className="text-sm text-gray-500 mt-1">You can use {"{{name}}"} to personalize the subject</p>
//                         </div>

//                         <div className="mb-4">
//                             <label htmlFor="subject-line" className="block mb-1 font-medium">Campaign Name</label>
//                             <input
//                                 type="text"
//                                 id="campaign-name"
//                                 className="w-full p-2 border border-gray-300 rounded-md"
//                                 placeholder="Campaign Name"
//                                 value={campaignName}
//                                 onChange={(e) => setCampaignName(e.target.value)}
//                             />

//                         </div>
//                     </div>

//                     <div className="flex justify-between">
//                         <button
//                             className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
//                             onClick={() => goToStep(1)}
//                         >
//                             Back
//                         </button>
//                         <button
//                             className={`px-5 py-2 rounded-md ${nextToStep3Disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//                             // disabled={nextToStep3Disabled}
//                             onClick={() => goToStep(3)}
//                         >
//                             Next: Personalize
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Step 3: Personalize */}
//             <div className={`${activeStep === 3 ? 'block' : 'hidden'}`}>
//                 <div className="bg-white rounded-lg shadow-md p-8 mb-8">
//                     <h2 className="text-2xl text-blue-600 mb-5">Personalize Your Email</h2>

//                     <div className="mb-8">
//                         <h3 className="text-xl text-gray-800 mb-3">Map Data Fields to Template Variables</h3>
//                         <p className="mb-4 text-gray-600">Connect your Excel data columns to template placeholder variables</p>

//                         <div className="mb-4">
//                             {variableMappings.map((mapping, index) => (
//                                 <div key={index} className="flex items-center gap-3 mb-4">
//                                     <input
//                                         type="text"
//                                         className="flex-1 p-2 border border-gray-300 rounded-md"
//                                         placeholder="Template variable (e.g. name)"
//                                         value={mapping.placeholder}
//                                         onChange={(e) => updateVariableMapping(index, 'placeholder', e.target.value)}
//                                     />
//                                     <select
//                                         className="flex-1 p-2 border border-gray-300 rounded-md"
//                                         value={mapping.column}
//                                         onChange={(e) => updateVariableMapping(index, 'column', e.target.value)}
//                                     >
//                                         <option value="">Select Excel column</option>
//                                         {emailColumns.map((column, colIndex) => (
//                                             <option key={colIndex} value={column}>{column}</option>
//                                         ))}
//                                     </select>
//                                     <button
//                                         className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
//                                         onClick={() => removeVariableMapping(index)}
//                                     >
//                                         <X size={16} />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>

//                         <button
//                             className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
//                             onClick={addVariableMapping}
//                         >
//                             Add Variable
//                         </button>
//                     </div>

//                     <div className="mb-8">
//                         <h3 className="text-xl text-gray-800 mb-3">Email Preview</h3>
//                         <div className="p-4 border border-gray-200 rounded-md min-h-64 overflow-y-auto bg-gray-50">
//                             <div className="mb-2 text-sm text-gray-600 border-b pb-2">
//                                 <strong>Subject:</strong> {subjectLine || 'No subject set'}
//                             </div>
//                             <div
//                                 className="prose max-w-none"
//                                 dangerouslySetInnerHTML={{
//                                     __html: emailPreviewContent || 'Preview will appear here once the template is processed'
//                                 }}
//                             />
//                         </div>
//                     </div>

//                     <div className="flex justify-between">
//                         <button
//                             className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
//                             onClick={() => goToStep(2)}
//                         >
//                             Back
//                         </button>
//                         <button
//                             className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
//                             onClick={() => goToStep(4)}
//                         >
//                             Next: Send
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Step 4: Send */}
//             <div className={`${activeStep === 4 ? 'block' : 'hidden'}`}>
//                 <div className="bg-white rounded-lg shadow-md p-8 mb-8">
//                     <h2 className="text-2xl text-blue-600 mb-5">Review & Send</h2>

//                     {!isSending && !sendingComplete && (
//                         <div className="mb-8">
//                             <h3 className="text-xl text-gray-800 mb-3">Sending Summary</h3>
//                             <div className="bg-gray-100 p-4 rounded-md mb-5">
//                                 <div className="mb-2">
//                                     <span className="font-semibold mr-2">Total Recipients:</span> {recipientCount}
//                                 </div>
//                                 <div className="mb-2">
//                                     <span className="font-semibold mr-2">From:</span> {senderName} &lt;{emailUser}&gt;
//                                 </div>
//                                 <div className="mb-2">
//                                     <span className="font-semibold mr-2">Subject:</span> {subjectLine}
//                                 </div>
//                                 <div className="mb-2">
//                                     <span className="font-semibold mr-2">Email Column:</span> {selectedEmailColumn}
//                                 </div>
//                                 <div className="mb-2">
//                                     <span className="font-semibold mr-2">Name Column:</span> {selectedNameColumn || 'Not selected'}
//                                 </div>
//                                 <div>
//                                     <span className="font-semibold mr-2">SMTP Server:</span> {smtpServer}:{smtpPort}
//                                 </div>
//                             </div>

//                             <div className="mb-5">
//                                 <h4 className="font-semibold mb-2">Variable Mappings</h4>
//                                 <div className="bg-gray-50 p-3 rounded-md">
//                                     {variableMappings.length > 0 && variableMappings.some(m => m.placeholder && m.column) ? (
//                                         variableMappings.filter(m => m.placeholder && m.column).map((mapping, index) => (
//                                             <div key={index} className="mb-1">
//                                                 <span className="text-blue-600">{"{{" + mapping.placeholder + "}}"}</span> → <span className="text-green-600">{mapping.column}</span>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <span className="text-gray-500">No custom variables mapped</span>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="mb-5">
//                                 <h4 className="font-semibold mb-2">Sending Settings</h4>
//                                 <div className="mb-4">
//                                     <label htmlFor="delay-emails" className="block mb-1">Delay Between Emails (ms)</label>
//                                     <input
//                                         type="number"
//                                         id="delay-emails"
//                                         className="w-full p-2 border border-gray-300 rounded-md"
//                                         min="500"
//                                         value={delayBetweenEmails}
//                                         onChange={(e) => setDelayBetweenEmails(parseInt(e.target.value) || 2000)}
//                                     />
//                                     <p className="text-xs text-gray-500 mt-1">Recommended: 1000ms - 5000ms to avoid being flagged as spam</p>
//                                 </div>
//                             </div>

//                             <div className="flex justify-center">
//                                 <button
//                                     className="px-8 py-3 rounded-md bg-green-600 text-white text-lg hover:bg-green-700 flex items-center gap-2"
//                                     onClick={startSending}
//                                 >
//                                     <Mail size={20} />
//                                     Start Sending ({recipientCount} emails)
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {(isSending || sendingComplete) && (
//                         <div className="mb-8">
//                             <h3 className="text-xl text-gray-800 mb-3">Sending Progress</h3>

//                             <div className="bg-gray-100 p-4 rounded-md mb-5">
//                                 <div className="flex justify-between items-center mb-2">
//                                     <span>Progress: {Math.round(sendingProgress)}%</span>
//                                     <span>{sentCount + failedCount} / {recipientCount}</span>
//                                 </div>
//                                 <div className="h-3 bg-gray-300 rounded-full mb-4">
//                                     <div
//                                         className="h-full bg-blue-600 rounded-full transition-all duration-300"
//                                         style={{ width: `${sendingProgress}%` }}
//                                     ></div>
//                                 </div>

//                                 <div className="grid grid-cols-3 gap-4 mb-3">
//                                     <div className="text-center">
//                                         <div className="text-3xl font-semibold text-green-600">{sentCount}</div>
//                                         <div className="text-sm text-gray-600">Sent</div>
//                                     </div>
//                                     <div className="text-center">
//                                         <div className="text-3xl font-semibold text-red-600">{failedCount}</div>
//                                         <div className="text-sm text-gray-600">Failed</div>
//                                     </div>
//                                     <div className="text-center">
//                                         <div className="text-3xl font-semibold text-blue-600">{remainingCount}</div>
//                                         <div className="text-sm text-gray-600">Remaining</div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="mb-5">
//                                 <h4 className="font-semibold mb-2">Sending Logs</h4>
//                                 <div className="border border-gray-200 rounded-md h-64 overflow-y-auto p-2 bg-gray-50">
//                                     {sendingLogs.map((log) => (
//                                         <div
//                                             key={log.id}
//                                             className={`px-3 py-2 mb-1 rounded-md text-sm ${log.type === 'success' ? 'bg-green-50 text-green-700 border-l-2 border-green-400' :
//                                                 log.type === 'error' ? 'bg-red-50 text-red-700 border-l-2 border-red-400' :
//                                                     'bg-blue-50 text-blue-700 border-l-2 border-blue-400'
//                                                 }`}
//                                         >
//                                             <span className="text-gray-500 text-xs mr-2">{log.time}</span>
//                                             {log.message}
//                                         </div>
//                                     ))}
//                                     {sendingLogs.length === 0 && (
//                                         <div className="text-center text-gray-500 p-4">Logs will appear here as emails are sent...</div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="flex justify-center gap-4">
//                                 {isSending ? (
//                                     <button
//                                         className="px-8 py-3 rounded-md bg-red-600 text-white text-lg hover:bg-red-700"
//                                         onClick={stopSending}
//                                     >
//                                         Stop Sending
//                                     </button>
//                                 ) : sendingComplete && (
//                                     <button
//                                         className="px-8 py-3 rounded-md bg-blue-600 text-white text-lg hover:bg-blue-700"
//                                         onClick={startOver}
//                                     >
//                                         Start Over
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {!isSending && !sendingComplete && (
//                         <div className="flex justify-between">
//                             <button
//                                 className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
//                                 onClick={() => goToStep(3)}
//                             >
//                                 Back
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//          </div >

//     );
// };



import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Settings, 
  FileText, 
  Send, 
  Mail, 
  X, 
  Plus, 
  ImageIcon, 
  Zap, 
  Users, 
  Target, 
  TrendingUp,
  ChevronRight,
  Sparkles,
  Bot,
  Edit3,
  Eye,
  Download,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function EmailMarketingTool() {
  const [activeStep, setActiveStep] = useState(1);
  const [activeTemplateTab, setActiveTemplateTab] = useState('upload');
  const [showImageManager, setShowImageManager] = useState(false);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  
  // File refs
  const excelFileRef = useRef(null);
  const templateFileRef = useRef(null);
  const imageFileRef = useRef(null);
  
  // State variables
  const [excelFileName, setExcelFileName] = useState('');
  const [templateFileName, setTemplateFileName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [recipientCount, setRecipientCount] = useState(0);
  const [selectedEmailColumn, setSelectedEmailColumn] = useState('');
  const [selectedNameColumn, setSelectedNameColumn] = useState('');
  const [subjectLine, setSubjectLine] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [emailColumns, setEmailColumns] = useState(['Email', 'Name', 'Company']);
  const [variableMappings, setVariableMappings] = useState([{placeholder: '', column: ''}]);
  const [delayBetweenEmails, setDelayBetweenEmails] = useState(2000);
  const [isSending, setIsSending] = useState(false);
  const [sendingComplete, setSendingComplete] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [sendingLogs, setSendingLogs] = useState([]);
  
  // AI Generator state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('professional');
  const [aiLength, setAiLength] = useState('medium');
  const [aiIndustry, setAiIndustry] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  
  // Progress states
  const [excelProgress, setExcelProgress] = useState(0);
  const [templateProgress, setTemplateProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState({});
  const [sendingProgress, setSendingProgress] = useState(0);
  
  // Mock data for preview
  const [excelPreview, setExcelPreview] = useState({
    headers: ['Email', 'Name', 'Company'],
    data: [
      ['john@example.com', 'John Doe', 'Tech Corp'],
      ['jane@example.com', 'Jane Smith', 'Design Inc'],
      ['mike@example.com', 'Mike Johnson', 'Marketing Ltd']
    ]
  });
  
  const remainingCount = recipientCount - sentCount - failedCount;
  
  const goToStep = (step) => {
    setActiveStep(step);
  };
  
  const generateAIEmail = async () => {
    setAiGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const sampleContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to {{company}}!</h2>
          <p>Dear {{name}},</p>
          <p>We're excited to introduce you to our latest ${aiIndustry} solutions that can help transform your business.</p>
          <p>Based on your industry expertise, we believe our platform can help you:</p>
          <ul>
            <li>Increase efficiency by 40%</li>
            <li>Reduce operational costs</li>
            <li>Streamline your workflow</li>
          </ul>
          <p>Would you be interested in a quick 15-minute demo to see how we can help {{company}}?</p>
          <p>Best regards,<br>Your Team</p>
        </div>
      `;
      setGeneratedContent(sampleContent);
      setTemplateContent(sampleContent);
      setAiGenerating(false);
      setShowAiGenerator(false);
    }, 2000);
  };
  
  const stats = [
    { label: 'Total Campaigns', value: '24', icon: Target, color: 'bg-blue-500' },
    { label: 'Total Sent', value: '12,450', icon: Mail, color: 'bg-green-500' },
    { label: 'Open Rate', value: '68%', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Active Contacts', value: '3,250', icon: Users, color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      {/* <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">EmailPro</h1>
                <p className="text-slate-500 text-sm">Professional Email Marketing Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Welcome back!</p>
                <p className="text-xs text-slate-500">Last login: Today</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto ">
        {/* Stats Dashboard */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {/* Main Content */}
        <div className="bg-white   overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Create Campaign</h2>
                <p className="text-blue-100 mt-1">Design and launch your email marketing campaign</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAiGenerator(true)}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Generator</span>
                </button>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="px-8 py-6 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between relative">
              {[
                { step: 1, icon: Upload, label: 'Upload Files', desc: 'Add your data & template' },
                { step: 2, icon: Settings, label: 'Configure', desc: 'Set up email settings' },
                { step: 3, icon: FileText, label: 'Personalize', desc: 'Map data fields' },
                { step: 4, icon: Send, label: 'Launch', desc: 'Review & send' }
              ].map((item, index) => (
                <div key={item.step} className="flex items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      activeStep >= item.step 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="text-center mt-3">
                      <p className={`font-semibold text-sm ${
                        activeStep >= item.step ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className={`h-0.5 w-24 transition-all duration-300 ${
                      activeStep > item.step ? 'bg-blue-600' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8">
            {/* Step 1: Upload Files */}
            {activeStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Your Data</h3>
                  <p className="text-slate-600">Start by uploading your contact list and email template</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Excel Upload */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Contact List</h4>
                        <p className="text-sm text-slate-600">Excel file with your contacts</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          ref={excelFileRef}
                          type="file"
                          accept=".xlsx,.xls"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => setExcelFileName(e.target.files[0]?.name || '')}
                        />
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-600">
                            {excelFileName || 'Drop your Excel file here or click to browse'}
                          </p>
                        </div>
                      </div>

                      {excelFileName && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Upload Progress</span>
                            <span className="text-blue-600">{excelProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{width: `${excelProgress}%`}} />
                          </div>
                        </div>
                      )}

                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Upload Excel File
                      </button>
                    </div>

                    {excelPreview && (
                      <div className="mt-6 bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                          <p className="text-sm font-medium text-slate-900">
                            Preview - {recipientCount || 3} contacts found
                          </p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-slate-50">
                                {excelPreview.headers.map((header, index) => (
                                  <th key={index} className="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {excelPreview.data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-slate-50">
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="px-4 py-2 text-sm text-slate-900">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Template Upload */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Edit3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Email Template</h4>
                          <p className="text-sm text-slate-600">Design your email content</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowAiGenerator(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg text-sm hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-1"
                      >
                        <Bot className="w-4 h-4" />
                        <span>AI Generate</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex bg-slate-200 rounded-lg p-1">
                        <button
                          onClick={() => setActiveTemplateTab('upload')}
                          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                            activeTemplateTab === 'upload'
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Upload HTML
                        </button>
                        <button
                          onClick={() => setActiveTemplateTab('paste')}
                          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                            activeTemplateTab === 'paste'
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Paste HTML
                        </button>
                      </div>

                      {activeTemplateTab === 'upload' ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <input
                              ref={templateFileRef}
                              type="file"
                              accept=".html,.htm"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => setTemplateFileName(e.target.files[0]?.name || '')}
                            />
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                              <p className="text-sm text-slate-600">
                                {templateFileName || 'Drop your HTML template here'}
                              </p>
                            </div>
                          </div>
                          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                            Upload Template
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <textarea
                            value={templateContent}
                            onChange={(e) => setTemplateContent(e.target.value)}
                            placeholder="Paste your HTML template here..."
                            className="w-full h-40 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                            Save Template
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => goToStep(2)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Next: Configure</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Configure */}
            {activeStep === 2 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Configure Email Settings</h3>
                  <p className="text-slate-600">Set up your email configuration and campaign details</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Column
                      </label>
                      <select
                        value={selectedEmailColumn}
                        onChange={(e) => setSelectedEmailColumn(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select email column</option>
                        {emailColumns.map((column, index) => (
                          <option key={index} value={column}>{column}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Name Column (Optional)
                      </label>
                      <select
                        value={selectedNameColumn}
                        onChange={(e) => setSelectedNameColumn(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select name column</option>
                        {emailColumns.map((column, index) => (
                          <option key={index} value={column}>{column}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Campaign Name
                      </label>
                      <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Enter campaign name"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Subject Line
                      </label>
                      <input
                        type="text"
                        value={subjectLine}
                        onChange={(e) => setSubjectLine(e.target.value)}
                        placeholder="Enter email subject"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Use {"{{name}}"} for personalization
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Use personalization tags like {"{{name}}"} and {"{{company}}"}</li>
                        <li>• Keep subject lines under 50 characters</li>
                        <li>• Test different subject lines for better open rates</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => goToStep(1)}
                    className="bg-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => goToStep(3)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Next: Personalize</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Personalize */}
            {activeStep === 3 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Personalize Your Email</h3>
                  <p className="text-slate-600">Map your data fields to template variables for personalization</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">Variable Mapping</h4>
                    <div className="space-y-4">
                      {variableMappings.map((mapping, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={mapping.placeholder}
                              onChange={(e) => {
                                const newMappings = [...variableMappings];
                                newMappings[index].placeholder = e.target.value;
                                setVariableMappings(newMappings);
                              }}
                              placeholder="Variable name (e.g., name)"
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="flex-1">
                            <select
                              value={mapping.column}
                              onChange={(e) => {
                                const newMappings = [...variableMappings];
                                newMappings[index].column = e.target.value;
                                setVariableMappings(newMappings);
                              }}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select column</option>
                              {emailColumns.map((column, colIndex) => (
                                <option key={colIndex} value={column}>{column}</option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={() => {
                              const newMappings = variableMappings.filter((_, i) => i !== index);
                              setVariableMappings(newMappings);
                            }}
                            className="w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setVariableMappings([...variableMappings, {placeholder: '', column: ''}])}
                        className="w-full bg-slate-200 text-slate-700 py-3 rounded-lg hover:bg-slate-300 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Variable</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">Email Preview</h4>
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 min-h-64">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="border-b border-slate-200 pb-3 mb-4">
                          <p className="text-sm font-medium text-slate-900">
                            Subject: {subjectLine || 'No subject set'}
                          </p>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          {templateContent ? (
                            <div dangerouslySetInnerHTML={{ __html: templateContent }} />
                          ) : (
                            <p className="text-slate-500">Template preview will appear here</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => goToStep(2)}
                    className="bg-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => goToStep(4)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Next: Launch</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Launch */}
            {activeStep === 4 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Review & Launch Campaign</h3>
                  <p className="text-slate-600">Final review before sending your campaign</p>
                </div>

                {!isSending && !sendingComplete && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <h4 className="font-medium text-slate-900 mb-4">Campaign Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Campaign Name:</span>
                          <span className="font-medium text-slate-900">{campaignName || 'Untitled Campaign'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Subject Line:</span>
                          <span className="font-medium text-slate-900">{subjectLine || 'No subject'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Total Recipients:</span>
                          <span className="font-medium text-slate-900">{recipientCount || 3}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Email Column:</span>
                          <span className="font-medium text-slate-900">{selectedEmailColumn || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Name Column:</span>
                          <span className="font-medium text-slate-900">{selectedNameColumn || 'Not selected'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <h4 className="font-medium text-slate-900 mb-4">Sending Settings</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Delay Between Emails (ms)
                          </label>
                          <input
                            type="number"
                            value={delayBetweenEmails}
                            onChange={(e) => setDelayBetweenEmails(Number(e.target.value))}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="1000"
                            max="10000"
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Recommended: 2000ms (2 seconds) to avoid rate limiting
                          </p>
                        </div>
                        
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <p className="text-sm text-yellow-800 font-medium">Important</p>
                          </div>
                          <p className="text-sm text-yellow-700 mt-1">
                            Once you start sending, you cannot stop the process. Please review everything carefully.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sending Progress */}
                {isSending && (
                  <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-white animate-pulse" />
                      </div>
                      <h4 className="text-xl font-semibold text-blue-900 mb-2">Sending Campaign...</h4>
                      <p className="text-blue-700 mb-6">Please don't close this window while sending</p>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700">Progress</span>
                          <span className="text-blue-900 font-medium">{Math.round(sendingProgress)}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{width: `${sendingProgress}%`}}
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{sentCount}</p>
                            <p className="text-sm text-slate-600">Sent</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-red-600">{failedCount}</p>
                            <p className="text-sm text-slate-600">Failed</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{remainingCount}</p>
                            <p className="text-sm text-slate-600">Remaining</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sending Complete */}
                {sendingComplete && (
                  <div className="bg-green-50 rounded-xl p-8 border border-green-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-green-900 mb-2">Campaign Sent Successfully!</h4>
                      <p className="text-green-700 mb-6">Your email campaign has been completed</p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{sentCount}</p>
                          <p className="text-sm text-slate-600">Successfully Sent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{failedCount}</p>
                          <p className="text-sm text-slate-600">Failed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{Math.round((sentCount / (sentCount + failedCount)) * 100)}%</p>
                          <p className="text-sm text-slate-600">Success Rate</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setActiveStep(1);
                          setIsSending(false);
                          setSendingComplete(false);
                          setSentCount(0);
                          setFailedCount(0);
                          setSendingProgress(0);
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create New Campaign
                      </button>
                    </div>
                  </div>
                )}

                {/* Sending Logs */}
                {(isSending || sendingComplete) && sendingLogs.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-4">Sending Logs</h4>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {sendingLogs.map((log, index) => (
                        <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                          log.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                          {log.status === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">{log.email}</p>
                            <p className="text-xs text-slate-500">{log.message}</p>
                          </div>
                          <span className="text-xs text-slate-400">{log.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!isSending && !sendingComplete && (
                  <div className="flex justify-between">
                    <button
                      onClick={() => goToStep(3)}
                      className="bg-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        setIsSending(true);
                        // Simulate sending process
                        const totalEmails = recipientCount || 3;
                        let currentSent = 0;
                        let currentFailed = 0;
                        
                        const sendInterval = setInterval(() => {
                          if (currentSent + currentFailed >= totalEmails) {
                            clearInterval(sendInterval);
                            setIsSending(false);
                            setSendingComplete(true);
                            return;
                          }
                          
                          const shouldFail = Math.random() < 0.1; // 10% failure rate
                          const email = `user${currentSent + currentFailed + 1}@example.com`;
                          
                          if (shouldFail) {
                            currentFailed++;
                            setFailedCount(currentFailed);
                            setSendingLogs(prev => [...prev, {
                              email,
                              status: 'failed',
                              message: 'Failed to send: Invalid email address',
                              timestamp: new Date().toLocaleTimeString()
                            }]);
                          } else {
                            currentSent++;
                            setSentCount(currentSent);
                            setSendingLogs(prev => [...prev, {
                              email,
                              status: 'success',
                              message: 'Email sent successfully',
                              timestamp: new Date().toLocaleTimeString()
                            }]);
                          }
                          
                          setSendingProgress(((currentSent + currentFailed) / totalEmails) * 100);
                        }, delayBetweenEmails);
                      }}
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all flex items-center space-x-2 shadow-lg"
                    >
                      <Send className="w-5 h-5" />
                      <span>Launch Campaign</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Generator Modal */}
      {showAiGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">AI Email Generator</h3>
                    <p className="text-slate-600">Create professional email templates with AI</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiGenerator(false)}
                  className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center hover:bg-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Purpose/Goal
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe what you want to achieve with this email (e.g., introduce new product, follow up with leads, welcome new subscribers)"
                  className="w-full h-24 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tone
                  </label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="enthusiastic">Enthusiastic</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Length
                  </label>
                  <select
                    value={aiLength}
                    onChange={(e) => setAiLength(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={aiIndustry}
                    onChange={(e) => setAiIndustry(e.target.value)}
                    placeholder="e.g., Tech, Healthcare"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAiGenerator(false)}
                  className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={generateAIEmail}
                  disabled={aiGenerating || !aiPrompt}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {aiGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}