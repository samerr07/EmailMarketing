// Global state
const state = {
  excelFile: null,
  excelFilePath: null,
  excelData: null,
  templateFile: null,
  templateFilePath: null,
  templateContent: null,
  emailColumn: null,
  nameColumn: null,
  subjectLine: '',
  smtpServer: '',
  smtpPort: '465',
  emailUser: '',
  emailPass: '',
  senderName: '',
  variables: [],
  totalRecipients: 0,
  currentStep: 1
};

// DOM elements
const elements = {
  // Step navigation
  steps: document.querySelectorAll('.step'),
  stepContents: document.querySelectorAll('.step-content'),
  
  // Step 1: Upload Files
  excelFileInput: document.getElementById('excel-file'),
  excelFileName: document.getElementById('excel-file-name'),
  excelProgress: document.getElementById('excel-progress'),
  uploadExcelBtn: document.getElementById('upload-excel-btn'),
  excelPreviewContainer: document.getElementById('excel-preview-container'),
  
  templateFileInput: document.getElementById('template-file'),
  templateFileName: document.getElementById('template-file-name'),
  templateProgress: document.getElementById('template-progress'),
  uploadTemplateBtn: document.getElementById('upload-template-btn'),
  
  templateContent: document.getElementById('template-content'),
  saveTemplateBtn: document.getElementById('save-template-btn'),
  templatePreview: document.getElementById('template-preview'),
  
  tabBtns: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  
  nextToStep2: document.getElementById('next-to-step2'),
  
  // Step 2: Configure
  smtpServer: document.getElementById('smtp-server'),
  smtpPort: document.getElementById('smtp-port'),
  emailUser: document.getElementById('email-user'),
  emailPass: document.getElementById('email-pass'),
  senderName: document.getElementById('sender-name'),
  testConnection: document.getElementById('test-connection'),
  connectionStatus: document.getElementById('connection-status'),
  
  emailColumn: document.getElementById('email-column'),
  nameColumn: document.getElementById('name-column'),
  subjectLine: document.getElementById('subject-line'),
  
  backToStep1: document.getElementById('back-to-step1'),
  nextToStep3: document.getElementById('next-to-step3'),
  
  // Step 3: Personalize
  variableMappings: document.getElementById('variable-mappings'),
  addVariable: document.getElementById('add-variable'),
  emailPreview: document.getElementById('email-preview'),
  
  backToStep2: document.getElementById('back-to-step2'),
  nextToStep4: document.getElementById('next-to-step4'),
  
  // Step 4: Send
  recipientCount: document.getElementById('recipient-count'),
  templateName: document.getElementById('template-name'),
  emailColumnName: document.getElementById('email-column-name'),
  subjectLinePreview: document.getElementById('subject-line-preview'),
  
  startSending: document.getElementById('start-sending'),
  sendingProgress: document.getElementById('sending-progress'),
  sendingProgressBar: document.getElementById('sending-progress-bar'),
  progressCount: document.getElementById('progress-count'),
  progressPercent: document.getElementById('progress-percent'),
  
  sentCount: document.getElementById('sent-count'),
  failedCount: document.getElementById('failed-count'),
  remainingCount: document.getElementById('remaining-count'),
  
  sendingLog: document.getElementById('sending-log'),
  
  sendingComplete: document.getElementById('sending-complete'),
  finalSentCount: document.getElementById('final-sent-count'),
  finalFailedCount: document.getElementById('final-failed-count'),
  finalTotalCount: document.getElementById('final-total-count'),
  
  startOver: document.getElementById('start-over'),
  backToStep3: document.getElementById('back-to-step3')
};

// Initialize the application
function init() {
  attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
  // Step 1 events
  elements.excelFileInput.addEventListener('change', handleExcelFileSelect);
  elements.uploadExcelBtn.addEventListener('click', uploadExcelFile);
  
  elements.templateFileInput.addEventListener('change', handleTemplateFileSelect);
  elements.uploadTemplateBtn.addEventListener('click', uploadTemplateFile);
  
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
  
  elements.saveTemplateBtn.addEventListener('click', saveTemplateContent);
  elements.nextToStep2.addEventListener('click', () => goToStep(2));
  
  // Step 2 events
  elements.testConnection.addEventListener('click', testConnection);
  elements.backToStep1.addEventListener('click', () => goToStep(1));
  elements.nextToStep3.addEventListener('click', () => goToStep(3));
  
  // Monitor inputs for enabling next button
  elements.smtpServer.addEventListener('input', validateStep2);
  elements.emailUser.addEventListener('input', validateStep2);
  elements.emailPass.addEventListener('input', validateStep2);
  elements.emailColumn.addEventListener('change', validateStep2);
  elements.subjectLine.addEventListener('input', validateStep2);
  
  // Step 3 events
  elements.addVariable.addEventListener('click', addVariableMapping);
  elements.backToStep2.addEventListener('click', () => goToStep(2));
  elements.nextToStep4.addEventListener('click', () => {
    prepareStep4();
    goToStep(4);
  });
  
  // Step 4 events
  elements.startSending.addEventListener('click', startSendingEmails);
  elements.backToStep3.addEventListener('click', () => goToStep(3));
  elements.startOver.addEventListener('click', resetApplication);
}

// Handle Excel file selection
function handleExcelFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    alert('Please select a valid Excel file (.xlsx or .xls)');
    elements.excelFileInput.value = '';
    elements.excelFileName.textContent = '';
    return;
  }
  
  state.excelFile = file;
  elements.excelFileName.textContent = file.name;
  elements.uploadExcelBtn.disabled = false;
}

// Upload Excel file
function uploadExcelFile() {
  if (!state.excelFile) return;
  
  const formData = new FormData();
  formData.append('excel', state.excelFile);
  
  // Show progress
  const progressBar = elements.excelProgress.querySelector('.progress');
  progressBar.style.width = '0%';
  
  fetch('/preview-excel', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Update progress bar
      progressBar.style.width = '100%';
      
      // Store data
      state.excelFilePath = data.filePath;
      state.excelData = {
        headers: data.headers,
        sample: data.sample,
        totalRows: data.totalRows
      };
      
      // Display preview
      renderExcelPreview(data.headers, data.sample, data.totalRows);
      
      // Update name and email dropdowns
      populateColumnDropdowns(data.headers);
      
      // Check if we can enable next button
      validateStep1();
    } else {
      alert('Error uploading Excel file: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error uploading file. Please try again.');
  });
}

// Render Excel preview
function renderExcelPreview(headers, sample, totalRows) {
  if (!sample || sample.length === 0) {
    elements.excelPreviewContainer.innerHTML = '<p class="alert error">No data found in the Excel file</p>';
    return;
  }
  
  let html = `
    <div class="preview-header">
      <h4>Excel Preview (${totalRows} total records)</h4>
    </div>
    <table>
      <thead>
        <tr>
          ${headers.map(header => `<th>${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
  `;
  
  sample.forEach(row => {
    html += '<tr>';
    headers.forEach(header => {
      html += `<td>${row[header] || ''}</td>`;
    });
    html += '</tr>';
  });
  
  html += `
      </tbody>
    </table>
  `;
  
  elements.excelPreviewContainer.innerHTML = html;
  state.totalRecipients = totalRows;
}

// Populate column dropdowns
function populateColumnDropdowns(headers) {
  // Clear dropdowns
  elements.emailColumn.innerHTML = '<option value="">Select column containing emails</option>';
  elements.nameColumn.innerHTML = '<option value="">Select column containing names (optional)</option>';
  
  // Add headers to dropdowns
  headers.forEach(header => {
    const emailOption = document.createElement('option');
    emailOption.value = header;
    emailOption.textContent = header;
    elements.emailColumn.appendChild(emailOption);
    
    const nameOption = document.createElement('option');
    nameOption.value = header;
    nameOption.textContent = header;
    elements.nameColumn.appendChild(nameOption);
  });
}

// Handle HTML template file selection
function handleTemplateFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
    alert('Please select a valid HTML file (.html or .htm)');
    elements.templateFileInput.value = '';
    elements.templateFileName.textContent = '';
    return;
  }
  
  state.templateFile = file;
  elements.templateFileName.textContent = file.name;
  elements.uploadTemplateBtn.disabled = false;
}

// Upload template file
function uploadTemplateFile() {
  if (!state.templateFile) return;
  
  const formData = new FormData();
  formData.append('template', state.templateFile);
  
  // Show progress
  const progressBar = elements.templateProgress.querySelector('.progress');
  progressBar.style.width = '0%';
  
  fetch('/upload-template', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Update progress bar
      progressBar.style.width = '100%';
      
      // Store data
      state.templateFilePath = data.filePath;
      state.templateContent = data.template;
      
      // Update preview
      elements.templatePreview.innerHTML = `
        <div class="preview-header">
          <h4>Template Preview</h4>
        </div>
        <div class="template-content">
          <pre>${escapeHtml(data.template.substring(0, 200))}${data.template.length > 200 ? '...' : ''}</pre>
        </div>
      `;
      
      // Check if we can enable next button
      validateStep1();
    } else {
      alert('Error uploading template: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error uploading template. Please try again.');
  });
}

// Save template content from textarea
function saveTemplateContent() {
  const content = elements.templateContent.value.trim();
  if (!content) {
    alert('Please enter HTML template content');
    return;
  }
  
  state.templateContent = content;
  
  // Create a blob and form data to send to the server
  const blob = new Blob([content], { type: 'text/html' });
  const file = new File([blob], 'template.html', { type: 'text/html' });
  
  const formData = new FormData();
  formData.append('template', file);
  
  fetch('/upload-template', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      state.templateFilePath = data.filePath;
      
      // Update preview
      elements.templatePreview.innerHTML = `
        <div class="preview-header">
          <h4>Template Preview</h4>
        </div>
        <div class="template-content">
          <pre>${escapeHtml(content.substring(0, 200))}${content.length > 200 ? '...' : ''}</pre>
        </div>
      `;
      
      // Check if we can enable next button
      validateStep1();
    } else {
      alert('Error saving template: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error saving template. Please try again.');
  });
}

// Switch template tab
function switchTab(tabId) {
  elements.tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  
  elements.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === `${tabId}-tab`);
  });
}

// Test SMTP connection
function testConnection() {
  const smtpServer = elements.smtpServer.value.trim();
  const smtpPort = elements.smtpPort.value;
  const emailUser = elements.emailUser.value.trim();
  const emailPass = elements.emailPass.value;
  
  if (!smtpServer || !emailUser || !emailPass) {
    alert('Please fill in all SMTP fields');
    return;
  }
  
  elements.testConnection.disabled = true;
  elements.testConnection.textContent = 'Testing...';
  elements.connectionStatus.className = '';
  elements.connectionStatus.textContent = '';
  
  fetch('/test-connection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      smtpServer,
      smtpPort,
      emailUser,
      emailPass
    })
  })
  .then(response => response.json())
  .then(data => {
    elements.testConnection.disabled = false;
    elements.testConnection.textContent = 'Test Connection';
    
    if (data.success) {
      elements.connectionStatus.className = 'success';
      elements.connectionStatus.textContent = data.message;
      
      // Update state
      state.smtpServer = smtpServer;
      state.smtpPort = smtpPort;
      state.emailUser = emailUser;
      state.emailPass = emailPass;
      state.senderName = elements.senderName.value.trim();
      
      // Check if we can enable next button
      validateStep2();
    } else {
      elements.connectionStatus.className = 'error';
      elements.connectionStatus.textContent = 'Connection failed: ' + data.error;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    elements.testConnection.disabled = false;
    elements.testConnection.textContent = 'Test Connection';
    elements.connectionStatus.className = 'error';
    elements.connectionStatus.textContent = 'Error testing connection. Please try again.';
  });
}

// Add variable mapping field
function addVariableMapping() {
  const mapping = document.createElement('div');
  mapping.className = 'variable-mapping';
  
  const placeholderInput = document.createElement('input');
  placeholderInput.type = 'text';
  placeholderInput.placeholder = 'Placeholder name (without {{}})'
  placeholderInput.className = 'variable-placeholder';
  
  const columnSelect = document.createElement('select');
  columnSelect.className = 'variable-column';
  
  // Add empty option
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = 'Select Excel column';
  columnSelect.appendChild(emptyOption);
  
  // Add headers to dropdown
  if (state.excelData && state.excelData.headers) {
    state.excelData.headers.forEach(header => {
      const option = document.createElement('option');
      option.value = header;
      option.textContent = header;
      columnSelect.appendChild(option);
    });
  }
  
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-variable';
  removeBtn.textContent = '×';
  removeBtn.addEventListener('click', () => {
    mapping.remove();
    updateVariableState();
  });
  
  mapping.appendChild(placeholderInput);
  mapping.appendChild(columnSelect);
  mapping.appendChild(removeBtn);
  
  elements.variableMappings.appendChild(mapping);
  
  // Update event listeners for preview
  placeholderInput.addEventListener('input', updateVariableState);
  columnSelect.addEventListener('change', updateVariableState);
}

// Update variable mappings state
function updateVariableState() {
  const mappings = elements.variableMappings.querySelectorAll('.variable-mapping');
  const variables = [];
  
  mappings.forEach(mapping => {
    const placeholder = mapping.querySelector('.variable-placeholder').value.trim();
    const column = mapping.querySelector('.variable-column').value;
    
    if (placeholder && column) {
      variables.push({ placeholder, column });
    }
  });
  
  state.variables = variables;
  updateEmailPreview();
}

// Update email preview
function updateEmailPreview() {
  if (!state.templateContent || !state.excelData || !state.excelData.sample) {
    return;
  }
  
  // Get the first sample record
  const sampleData = state.excelData.sample[0] || {};
  
  // Start with the template
  let preview = state.templateContent;
  
  // Replace variables
  state.variables.forEach(variable => {
    if (variable.placeholder && variable.column) {
      const value = sampleData[variable.column] || '';
      const regex = new RegExp(`{{${variable.placeholder}}}`, 'g');
      preview = preview.replace(regex, value);
    }
  });
  
  // Show preview
  elements.emailPreview.innerHTML = `
    <div class="preview-header">
      <h4>Email Preview (sample recipient)</h4>
    </div>
    <div class="preview-frame">
      ${preview}
    </div>
  `;
}

// Prepare step 4
function prepareStep4() {
  // Update review information
  elements.recipientCount.textContent = state.totalRecipients;
  elements.templateName.textContent = state.templateFile ? state.templateFile.name : 'Pasted template';
  elements.emailColumnName.textContent = state.emailColumn || 'Not selected';
  elements.subjectLinePreview.textContent = state.subjectLine || 'Not set';
}

// Start sending emails
// Start sending emails
function startSendingEmails() {
  // Disable buttons
  elements.startSending.disabled = true;
  elements.backToStep3.disabled = true;
  
  // Show progress container
  elements.sendingProgress.classList.remove('hidden');
  
  // Prepare data for API request
  const data = {
    excelPath: state.excelFilePath,
    htmlPath: state.templateFilePath,
    emailColumn: state.emailColumn,
    nameColumn: state.nameColumn,
    subjectLine: state.subjectLine,
    smtpServer: state.smtpServer,
    smtpPort: state.smtpPort,
    emailUser: state.emailUser,
    emailPass: state.emailPass,
    senderName: state.senderName,
    variables: state.variables
  };
  
  // Reset counters
let success = 0;
let failed = 0;
let total = 0;
let jobId = null;
let checkStatusInterval = null;
  
  // Send the request data
  fetch('/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Store job ID and total emails
      jobId = data.jobId;
      total = data.total;
      
      // Initialize UI
      elements.progressCount.textContent = `0 / ${total}`;
      elements.sentCount.textContent = '0';
      elements.failedCount.textContent = '0';
      elements.remainingCount.textContent = total.toString();
      
      if (data.skipped > 0) {
        logMessage(`Warning: ${data.skipped} emails were skipped due to the 500 email limit.`, 'error');
      }
      
      logMessage('Starting to send emails...', 'info');
      
      // Start polling for status updates
      checkStatusInterval = setInterval(() => checkSendStatus(jobId), 1000);
    } else {
      logMessage(`Error: ${data.message}`, 'error');
      elements.backToStep3.disabled = false;
    }
  })
  .catch(error => {
    console.error('Error starting send process:', error);
    logMessage('Error starting sending process: ' + error.message, 'error');
    elements.backToStep3.disabled = false;
  });
  
  // Function to check status
  function checkSendStatus(jobId) {
    fetch(`/send-status/${jobId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Update counters
          const sent = data.sent;
          const failed = data.failed;
          const current = sent + failed;
          const progressPercent = Math.round((current / total) * 100);
          
          // Update progress bar
          elements.sendingProgressBar.querySelector('.progress').style.width = `${progressPercent}%`;
          elements.progressCount.textContent = `${current} / ${total}`;
          elements.progressPercent.textContent = `${progressPercent}%`;
          
          // Update counters
          elements.sentCount.textContent = sent.toString();
          elements.failedCount.textContent = failed.toString();
          elements.remainingCount.textContent = (total - current).toString();
          
          // Check if completed
          if (data.completed || data.stopped) {
            clearInterval(checkStatusInterval);
            
            // Update final counters
            elements.sendingProgressBar.querySelector('.progress').style.width = '100%';
            elements.progressCount.textContent = `${total} / ${total}`;
            elements.progressPercent.textContent = '100%';
            
            // Show completion section
            elements.sendingComplete.classList.remove('hidden');
            elements.finalSentCount.textContent = sent.toString();
            elements.finalFailedCount.textContent = failed.toString();
            elements.finalTotalCount.textContent = total.toString();
            
            // Log completion
            logMessage(`Sending complete: ${sent} sent, ${failed} failed`, 'info');
            
            // Re-enable back button
            elements.backToStep3.disabled = false;
          }
          
          // Check for errors
          if (data.error) {
            logMessage(`Error: ${data.error}`, 'error');
          }
        } else {
          logMessage(`Error checking status: ${data.message}`, 'error');
        }
      })
      .catch(error => {
        console.error('Error checking send status:', error);
        logMessage('Connection to server lost. Please check if all emails were sent.', 'error');
        
        // Re-enable back button
        elements.backToStep3.disabled = false;
        
        // Stop checking
        clearInterval(checkStatusInterval);
      });
  }
}

function stopSending() {
  fetch('/stop-sending', { method: 'POST' })
      .then(() => {
          appendLog('⛔ Stop request sent to server.');
      })
      .catch((err) => {
          appendLog('⚠️ Failed to send stop request.');
          console.error(err);
      });
}


// Add a function to stop sending
function stopSendingEmails() {
  const jobId = state.currentJobId; // You'll need to save this when starting the job
  
  if (!jobId) {
    logMessage('No active job to stop', 'error');
    return;
  }
  
  fetch('/stop-sending', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ jobId })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      logMessage('Stopping email sending process...', 'info');
    } else {
      logMessage('Failed to stop sending: ' + (data.message || 'Unknown error'), 'error');
    }
  })
  .catch(error => {
    logMessage('Error stopping sending: ' + error.message, 'error');
  });
}

// Make sure to add this event listener
if (elements.stopSending) {
  elements.stopSending.addEventListener('click', stopSending);
}

// Add this utility function if you don't already have it
function clearLog() {
  const logContainer = document.querySelector('.sending-log') || elements.sendingLog;
  if (logContainer) {
    logContainer.innerHTML = '';
  }
}

// Log a message to the sending log
function logMessage(message, type = 'info') {
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry ${type}`;
  
  const time = new Date().toLocaleTimeString();
  logEntry.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;
  
  elements.sendingLog.appendChild(logEntry);
  elements.sendingLog.scrollTop = elements.sendingLog.scrollHeight;
}

// Reset the application
function resetApplication() {
  // Reset state
  Object.assign(state, {
    excelFile: null,
    excelFilePath: null,
    excelData: null,
    templateFile: null,
    templateFilePath: null,
    templateContent: null,
    emailColumn: null,
    nameColumn: null,
    subjectLine: '',
    variables: [],
    totalRecipients: 0,
    currentStep: 1
  });
  
  // Reset UI
  elements.excelFileInput.value = '';
  elements.excelFileName.textContent = '';
  elements.templateFileInput.value = '';
  elements.templateFileName.textContent = '';
  elements.templateContent.value = '';
  elements.excelPreviewContainer.innerHTML = '';
  elements.templatePreview.innerHTML = '';
  
  elements.emailColumn.innerHTML = '<option value="">Select column containing emails</option>';
  elements.nameColumn.innerHTML = '<option value="">Select column containing names</option>';
  elements.subjectLine.value = '';
  
  elements.variableMappings.innerHTML = '';
  elements.emailPreview.innerHTML = '';
  
  elements.uploadExcelBtn.disabled = true;
  elements.uploadTemplateBtn.disabled = true;
  elements.nextToStep2.disabled = true;
  elements.nextToStep3.disabled = true;
  
  elements.sendingProgress.classList.add('hidden');
  elements.sendingComplete.classList.add('hidden');
  elements.sendingLog.innerHTML = '';
  
  // Go back to step 1
  goToStep(1);
}

// Validate step 1
function validateStep1() {
  const isValid = state.excelFilePath && state.templateFilePath;
  elements.nextToStep2.disabled = !isValid;
}


  // Validate step 2
function validateStep2() {
  // Get form values
  state.emailColumn = elements.emailColumn.value;
  state.nameColumn = elements.nameColumn.value;
  state.subjectLine = elements.subjectLine.value;
  state.smtpServer = elements.smtpServer.value.trim();
  state.smtpPort = elements.smtpPort.value;
  state.emailUser = elements.emailUser.value.trim();
  state.emailPass = elements.emailPass.value;
  state.senderName = elements.senderName.value.trim();
  
  // Check if required fields are filled
  const isValid = state.emailColumn && state.subjectLine && 
                  state.smtpServer && state.smtpPort && 
                  state.emailUser && state.emailPass;
  
  elements.nextToStep3.disabled = !isValid;
}

// Navigate to a specific step
function goToStep(step) {
  // Update state
  state.currentStep = step;
  
  // Update UI
  elements.steps.forEach((element, index) => {
    element.classList.toggle('active', index + 1 === step);
  });
  
  elements.stepContents.forEach((element, index) => {
    element.classList.toggle('active', index + 1 === step);
  });
  
  // Prepare step if needed
  switch(step) {
    case 3:
      // Make sure we have at least one variable mapping
      if (elements.variableMappings.children.length === 0) {
        addVariableMapping();
      }
      updateEmailPreview();
      break;
  }
}

// Escape HTML special characters to prevent XSS
function escapeHtml(html) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// Add these new properties to your state object
// In your existing state object add:
// currentJobId: null,
// isSending: false,

// Modified resetApplication function to also reset the sending state
function resetApplication() {
  // Reset state
  Object.assign(state, {
    excelFile: null,
    excelFilePath: null,
    excelData: null,
    templateFile: null,
    templateFilePath: null,
    templateContent: null,
    emailColumn: null,
    nameColumn: null,
    subjectLine: '',
    variables: [],
    totalRecipients: 0,
    currentStep: 1,
    currentJobId: null,
    isSending: false
  });
  
  // Reset UI
  // ... (rest of your reset code)
  
  // Reset sending controls
  if (elements.stopSending) {
    elements.stopSending.disabled = false;
    elements.stopSending.textContent = 'Stop Sending';
  }
  
  // ... (rest of your reset code)
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);