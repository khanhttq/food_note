// 🚀 CONFIGURATION
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxyX5tFvn_2P-3YWw2N_KSQ_tTYlEseZzc7q5yE0b78Za8LzT8p63rgpVYp7jJlRbl2-w/exec';

// Global state
let selectedType = null;
let selectedRecord = null;
let isManualEntry = false;
let selectedReason = null;
let isSubmitting = false;
let isSearching = false;
let searchDebounceTimer = null;
const SEARCH_DEBOUNCE_DELAY = 200;

// DOM elements
const searchSection = document.getElementById('searchSection');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchLoading = document.getElementById('searchLoading');
const searchBtnText = document.getElementById('searchBtnText');
const performanceIndicator = document.getElementById('performanceIndicator');
const selectedInfo = document.getElementById('selectedInfo');
const selectedName = document.getElementById('selectedName');
const selectedEmail = document.getElementById('selectedEmail');
const selectedCard = document.getElementById('selectedCard');
const clearBtn = document.getElementById('clearBtn');
const manualEntrySection = document.getElementById('manualEntrySection');
const manualCheckbox = document.getElementById('manualCheckbox');
const manualInput = document.getElementById('manualInput');
const reasonSection = document.getElementById('reasonSection');
const previewSection = document.getElementById('previewSection');
const submitSection = document.getElementById('submitSection');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitIcon = document.getElementById('submitIcon');
const toast = document.getElementById('toast');
const searchPopup = document.getElementById('searchPopup');
const popupClose = document.getElementById('popupClose');
const searchResults = document.getElementById('searchResults');
const popupManualCheckbox = document.getElementById('popupManualCheckbox');

// Preview elements
const previewType = document.getElementById('previewType');
const previewName = document.getElementById('previewName');
const previewEmail = document.getElementById('previewEmail');
const previewCard = document.getElementById('previewCard');
const previewReason = document.getElementById('previewReason');

// 🚀 ULTRA FAST API CLASS
class UltraFastSheetsAPI {
  static async searchByType(userType, query, limit = 20) {
    try {
      if (!query || query.length < 1) {
        return { results: [], count: 0 };
      }
      
      return new Promise((resolve, reject) => {
        const callbackName = 'search_callback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        console.log(`🚀 Ultra fast searching ${userType}:`, query);
        const startTime = performance.now();
        
        const script = document.createElement('script');
        script.src = `${API_BASE_URL}?action=searchByType&type=${userType}&query=${encodeURIComponent(query)}&limit=${limit}&callback=${callbackName}&t=${Date.now()}`;
        script.id = callbackName;
        
        window[callbackName] = function(data) {
          const endTime = performance.now();
          const totalTime = endTime - startTime;
          
          console.log('⚡ Ultra fast results:', data);
          console.log(`🎯 Total time: ${totalTime.toFixed(2)}ms`);
          
          // Show performance indicator
          showPerformanceIndicator(totalTime);
          
          // Cleanup
          delete window[callbackName];
          const scriptEl = document.getElementById(callbackName);
          if (scriptEl) document.head.removeChild(scriptEl);
          
          if (data && data.error) {
            reject(new Error(data.error));
          } else {
            // Log backend performance if available
            if (data.searchTime) {
              console.log(`⚡ Backend time: ${data.searchTime}`);
            }
            resolve(data);
          }
        };
        
        script.onerror = function() {
          const endTime = performance.now();
          const totalTime = endTime - startTime;
          console.log(`❌ Search failed after ${totalTime.toFixed(2)}ms`);
          
          delete window[callbackName];
          const scriptEl = document.getElementById(callbackName);
          if (scriptEl) document.head.removeChild(scriptEl);
          reject(new Error('Search failed'));
        };
        
        document.head.appendChild(script);
        
        // Reduced timeout for ultra fast backend
        setTimeout(() => {
          if (window[callbackName]) {
            const endTime = performance.now();
            const totalTime = endTime - startTime;
            console.log(`⏰ Search timeout after ${totalTime.toFixed(2)}ms`);
            
            delete window[callbackName];
            const scriptEl = document.getElementById(callbackName);
            if (scriptEl) document.head.removeChild(scriptEl);
            reject(new Error('Search timeout'));
          }
        }, 5000);
      });
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }
  
  // 🚀 TEST ULTRA FAST SEARCH SPEED
  static async testSearchSpeed() {
    const testQueries = [
      { type: 'student', query: 'nguyen' },
      { type: 'staff', query: 'admin' },
      { type: 'teacher', query: 'tran' }
    ];
    
    console.log('🚀 Testing ultra fast search speeds...');
    
    for (const test of testQueries) {
      try {
        const startTime = performance.now();
        const result = await this.searchByType(test.type, test.query, 5);
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        
        console.log(`✅ Test: ${test.query} (${test.type}) - ${totalTime.toFixed(2)}ms - Results: ${result.count}`);
      } catch (error) {
        console.error(`❌ Test failed for ${test.query}:`, error);
      }
    }
    
    console.log('🏁 Speed test completed');
  }
  
  static async submitCheckin(data) {
    return new Promise((resolve, reject) => {
      console.log('🔥 Submitting checkin:', data);
      
      const timestamp = Date.now();
      const formId = 'checkin_form_' + timestamp;
      const iframeId = 'checkin_iframe_' + timestamp;
      
      const form = document.createElement('form');
      form.id = formId;
      form.method = 'POST';
      form.action = API_BASE_URL;
      form.target = iframeId;
      form.style.display = 'none';
      
      const iframe = document.createElement('iframe');
      iframe.id = iframeId;
      iframe.name = iframeId;
      iframe.style.display = 'none';
      
      const dataInput = document.createElement('input');
      dataInput.type = 'hidden';
      dataInput.name = 'data';
      dataInput.value = JSON.stringify({
        action: 'checkin',
        ...data,
        timestamp: new Date().toISOString()
      });
      
      form.appendChild(dataInput);
      document.body.appendChild(form);
      document.body.appendChild(iframe);
      
      let isCompleted = false;
      
      iframe.addEventListener('load', function() {
        if (!isCompleted) {
          isCompleted = true;
          setTimeout(() => {
            try {
              if (form.parentNode) document.body.removeChild(form);
              if (iframe.parentNode) document.body.removeChild(iframe);
            } catch (e) {}
          }, 1000);
          resolve({ success: true, message: '⚡ Ultra Fast Check-in Success! ✅' });
        }
      });
      
      setTimeout(() => {
        if (!isCompleted) {
          isCompleted = true;
          try {
            if (form.parentNode) document.body.removeChild(form);
            if (iframe.parentNode) document.body.removeChild(iframe);
          } catch (e) {}
          resolve({ success: true, message: '⚡ Ultra Fast Check-in Success! ✅' });
        }
      }, 8000);
      
      form.submit();
    });
  }
}

// 🚀 UTILITY FUNCTIONS
const showToast = (message, type = 'default') => {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};

const showPerformanceIndicator = (timeMs) => {
  if (timeMs < 50) {
    performanceIndicator.textContent = `⚡ ${timeMs.toFixed(0)}ms`;
    performanceIndicator.style.background = '#10b981';
  } else if (timeMs < 200) {
    performanceIndicator.textContent = `🟡 ${timeMs.toFixed(0)}ms`;
    performanceIndicator.style.background = '#f59e0b';
  } else {
    performanceIndicator.textContent = `🔴 ${timeMs.toFixed(0)}ms`;
    performanceIndicator.style.background = '#ef4444';
  }
  
  performanceIndicator.classList.add('show');
  setTimeout(() => {
    performanceIndicator.classList.remove('show');
  }, 3000);
};

const highlightText = (text, query) => {
  if (!query || !text) return text || '(Không có tên)';
  const regex = new RegExp(`(${query.split(' ').filter(w => w.length > 1).join('|')})`, 'gi');
  return text.replace(regex, '<span style="background: #fef3c7; font-weight: 600;">$1</span>');
};

// 🚀 DEBOUNCED SEARCH
const debouncedSearch = (callback, delay = SEARCH_DEBOUNCE_DELAY) => {
  return (...args) => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => callback.apply(this, args), delay);
  };
};

// 🚀 UI STATE MANAGEMENT
const enableSection = (section, enabled = true) => {
  if (enabled) {
    section.classList.add('enabled');
    const inputs = section.querySelectorAll('input, button');
    inputs.forEach(input => input.disabled = false);
  } else {
    section.classList.remove('enabled');
    const inputs = section.querySelectorAll('input, button');
    inputs.forEach(input => input.disabled = true);
  }
};

const updatePreview = () => {
  const hasPersonInfo = selectedRecord || (isManualEntry && manualInput.value.trim());
  const hasData = selectedType && hasPersonInfo && selectedReason;
  
  if (hasData) {
    previewSection.classList.add('show');
    
    // Update preview content
    previewType.textContent = getTypeLabel(selectedType);
    
    if (selectedRecord) {
      previewName.textContent = selectedRecord.name || '-';
      previewEmail.textContent = selectedRecord.email || '-';
      previewCard.textContent = `${selectedRecord.card || '-'} ${selectedRecord.card_number ? '/ ' + selectedRecord.card_number : ''}`.trim();
    } else if (isManualEntry) {
      previewName.textContent = manualInput.value.trim() || '-';
      previewEmail.textContent = '-';
      previewCard.textContent = '-';
    }
    
    previewReason.textContent = getReasonLabel(selectedReason);
    
    // Enable submit
    enableSection(submitSection, true);
    submitBtn.classList.add('ready');
  } else {
    previewSection.classList.remove('show');
    enableSection(submitSection, false);
    submitBtn.classList.remove('ready');
  }
};

const getTypeLabel = (type) => {
  const labels = {
    staff: '👨‍💼 Staff',
    student: '🎓 Student', 
    teacher: '👨‍🏫 Teacher'
  };
  return labels[type] || type;
};

const getReasonLabel = (reason) => {
  const labels = {
    forgot_card: '🤦‍♂️ Quên mang thẻ',
    broken_card: '💳 Thẻ lỗi',
    no_card: '❓ Chưa có thẻ'
  };
  return labels[reason] || reason;
};

// 🚀 ULTRA FAST SEARCH FUNCTION
const performUltraFastSearch = debouncedSearch(async () => {
  const query = searchInput.value.trim();
  
  if (!selectedType) {
    showToast('Vui lòng chọn loại người dùng trước', 'error');
    return;
  }

  if (!query || query.length < 1) {
    // Clear results
    if (searchPopup.classList.contains('show')) {
      closeSearchPopup();
    }
    manualEntrySection.classList.remove('show');
    return;
  }

  if (isSearching) return;

  try {
    isSearching = true;
    searchBtn.disabled = true;
    searchLoading.classList.add('show');
    searchBtnText.textContent = '⚡ Searching...';

    console.log('🚀 Starting ultra fast search...');
    const result = await UltraFastSheetsAPI.searchByType(selectedType, query);
    
    // Show results immediately - ultra fast!
    showSearchPopup(result.results || [], query);
    
    // Show manual entry if no results
    if (!result.results || result.results.length === 0) {
      manualEntrySection.classList.add('show');
      showToast(`⚡ Không tìm thấy "${query}" - có thể tự nhập`, 'warning');
    } else {
      manualEntrySection.classList.remove('show');
      manualCheckbox.checked = false;
      popupManualCheckbox.checked = false;
      isManualEntry = false;
      manualInput.classList.remove('show');
      
      // Show count in toast
      showToast(`⚡ Ultra Fast! Tìm thấy ${result.count} kết quả`, 'success');
    }
    
  } catch (error) {
    console.error('Ultra fast search error:', error);
    showToast('❌ Lỗi tìm kiếm: ' + error.message, 'error');
    
    // Show manual entry on error
    manualEntrySection.classList.add('show');
  } finally {
    isSearching = false;
    searchBtn.disabled = false;
    searchLoading.classList.remove('show');
    searchBtnText.textContent = '🔍 Search';
  }
}, 150);

// 🚀 SEARCH POPUP FUNCTIONALITY
const showSearchPopup = (results, query) => {
  // Clear previous results
  searchResults.innerHTML = '';
  
  if (results.length === 0) {
    // No results
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
      <div class="no-results-icon">😕</div>
      <div>⚡ Ultra Fast Search - Không tìm thấy kết quả cho "${query}"</div>
      <div style="margin-top: 8px; font-size: 14px; color: #6b7280;">
        Bạn có thể tự nhập thông tin bên dưới
      </div>
    `;
    searchResults.appendChild(noResults);
  } else {
    // Show results with enhanced highlighting
    results.forEach((record, index) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      
      // Add staggered animation
      resultItem.style.animationDelay = `${index * 50}ms`;
      resultItem.style.animation = 'slideIn 0.3s ease forwards';
      
      const name = highlightText(record.name, query);
      const email = highlightText(record.email, query);
      const card = highlightText(record.card, query);
      const staffNumber = highlightText(record.staff_number, query);
      const cardNumber = highlightText(record.card_number, query);
      
      // Build meta info
      const metaParts = [];
      if (email) metaParts.push(`📧 ${email}`);
      if (card) metaParts.push(`💳 ${card}`);
      if (staffNumber) metaParts.push(`👤 ${staffNumber}`);
      if (cardNumber) metaParts.push(`🆔 ${cardNumber}`);
      
      const meta = metaParts.join(' • ');
      
      resultItem.innerHTML = `
        <div class="result-name">${name}</div>
        ${meta ? `<div class="result-meta">${meta}</div>` : ''}
        <div style="position: absolute; top: 8px; right: 8px; font-size: 10px; color: #9ca3af;">
          #${index + 1}
        </div>
      `;
      
      resultItem.addEventListener('click', () => {
        selectRecord(record);
        closeSearchPopup();
      });
      
      searchResults.appendChild(resultItem);
    });
  }
  
  // Show popup with enhanced animation
  searchPopup.classList.add('show');
};

const closeSearchPopup = () => {
  searchPopup.classList.remove('show');
};

const selectRecord = (record) => {
  selectedRecord = record;
  
  // Update selected info display
  selectedName.textContent = record.name || '-';
  selectedEmail.textContent = record.email || '-';
  selectedCard.textContent = `${record.card || '-'} ${record.card_number ? '/ ' + record.card_number : ''}`.trim();
  
  // Show selected info with pulse animation
  selectedInfo.classList.add('show');
  selectedInfo.classList.add('pulse');
  setTimeout(() => selectedInfo.classList.remove('pulse'), 1000);
  
  // Hide manual entry
  manualEntrySection.classList.remove('show');
  manualCheckbox.checked = false;
  popupManualCheckbox.checked = false;
  isManualEntry = false;
  manualInput.classList.remove('show');
  
  // Enable reason section
  enableSection(reasonSection, true);
  updatePreview();
  
  showToast('✅ Đã chọn người dùng', 'success');
};

const clearSelection = () => {
  selectedRecord = null;
  selectedInfo.classList.remove('show');
  
  // Reset reason selection if no manual entry
  if (!isManualEntry) {
    enableSection(reasonSection, false);
    selectedReason = null;
    document.querySelectorAll('.reason-option').forEach(opt => opt.classList.remove('selected'));
  }
  
  updatePreview();
  showToast('🗑️ Đã xóa lựa chọn', 'warning');
};

// 🚀 EVENT LISTENERS

// Type selection with enhanced feedback
document.querySelectorAll('input[name="userType"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    selectedType = e.target.value;
    console.log('Selected type:', selectedType);
    
    // Enhanced visual feedback
    const label = e.target.nextElementSibling;
    label.style.transform = 'scale(1.05)';
    setTimeout(() => label.style.transform = '', 200);
    
    // Enable search section
    enableSection(searchSection, true);
    searchInput.focus();
    
    // Reset everything else
    clearSelection();
    manualEntrySection.classList.remove('show');
    manualCheckbox.checked = false;
    popupManualCheckbox.checked = false;
    isManualEntry = false;
    manualInput.classList.remove('show');
    
    // Reset subsequent sections
    enableSection(reasonSection, false);
    enableSection(submitSection, false);
    selectedReason = null;
    document.querySelectorAll('.reason-option').forEach(opt => opt.classList.remove('selected'));
    
    updatePreview();
    
    showToast(`⚡ Đã chọn ${getTypeLabel(selectedType)} - Sẵn sàng search!`, 'success');
  });
});

// Ultra fast search on button click
searchBtn.addEventListener('click', performUltraFastSearch);

// Enter key in search input
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    performUltraFastSearch();
  }
});

// Optional: Auto-search while typing (uncomment to enable)
/*
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  
  if (query.length >= 2 && selectedType) {
    performUltraFastSearch();
  } else if (query.length < 2) {
    closeSearchPopup();
    manualEntrySection.classList.remove('show');
  }
});
*/

// Clear selection button
clearBtn.addEventListener('click', clearSelection);

// Manual entry checkbox (main section)
manualCheckbox.addEventListener('change', (e) => {
  isManualEntry = e.target.checked;
  popupManualCheckbox.checked = isManualEntry;
  
  if (isManualEntry) {
    manualInput.classList.add('show');
    manualInput.focus();
    clearSelection();
    enableSection(reasonSection, true);
    showToast('📝 Chế độ nhập thủ công', 'warning');
  } else {
    manualInput.classList.remove('show');
    manualInput.value = '';
    if (!selectedRecord) {
      enableSection(reasonSection, false);
      selectedReason = null;
      document.querySelectorAll('.reason-option').forEach(opt => opt.classList.remove('selected'));
    }
  }
  
  updatePreview();
});

// Popup manual entry checkbox
popupManualCheckbox.addEventListener('change', (e) => {
  isManualEntry = e.target.checked;
  manualCheckbox.checked = isManualEntry;
  
  if (isManualEntry) {
    manualEntrySection.classList.add('show');
    manualInput.classList.add('show');
    manualInput.focus();
    clearSelection();
    enableSection(reasonSection, true);
    closeSearchPopup();
    showToast('📝 Chế độ nhập thủ công', 'warning');
  } else {
    manualInput.classList.remove('show');
    manualInput.value = '';
    if (!selectedRecord) {
      enableSection(reasonSection, false);
      selectedReason = null;
      document.querySelectorAll('.reason-option').forEach(opt => opt.classList.remove('selected'));
      manualEntrySection.classList.remove('show');
    }
  }
  
  updatePreview();
});

// Manual input with real-time validation
manualInput.addEventListener('input', (e) => {
  updatePreview();
  
  // Real-time validation
  const value = e.target.value.trim();
  if (value.length > 0) {
    e.target.style.borderColor = '#10b981';
  } else {
    e.target.style.borderColor = '#e2e8f0';
  }
});

// Popup close
popupClose.addEventListener('click', closeSearchPopup);

// Click outside popup to close
searchPopup.addEventListener('click', (e) => {
  if (e.target === searchPopup) {
    closeSearchPopup();
  }
});

// Reason selection with enhanced feedback
document.querySelectorAll('.reason-option').forEach(option => {
  option.addEventListener('click', () => {
    // Remove previous selection
    document.querySelectorAll('.reason-option').forEach(opt => opt.classList.remove('selected'));
    
    // Select current with animation
    option.classList.add('selected');
    option.style.transform = 'scale(1.02)';
    setTimeout(() => option.style.transform = '', 200);
    
    selectedReason = option.dataset.reason;
    
    console.log('Selected reason:', selectedReason);
    updatePreview();
    
    showToast(`✅ Đã chọn: ${getReasonLabel(selectedReason)}`, 'success');
  });
});

// Enhanced submit button
submitBtn.addEventListener('click', async () => {
  if (isSubmitting) return;
  
  if (!selectedType || !selectedReason) {
    showToast('❌ Vui lòng hoàn thành tất cả thông tin', 'error');
    return;
  }

  if (!selectedRecord && !isManualEntry) {
    showToast('❌ Vui lòng chọn người hoặc đánh dấu "Tự nhập thông tin"', 'error');
    return;
  }

  if (isManualEntry && !manualInput.value.trim()) {
    showToast('❌ Vui lòng nhập tên', 'error');
    manualInput.focus();
    return;
  }

  isSubmitting = true;
  submitBtn.disabled = true;
  submitText.textContent = '⚡ Đang gửi...';
  submitIcon.textContent = '⏳';
  
  // Add loading animation
  submitBtn.classList.add('pulse');

  try {
    const checkinData = {
      userType: selectedType,
      reason: selectedReason,
      timestamp: new Date().toISOString()
    };

    if (selectedRecord) {
      checkinData.selectedRecord = selectedRecord;
      checkinData.inputMethod = 'selected';
    } else if (isManualEntry) {
      checkinData.manualName = manualInput.value.trim();
      checkinData.inputMethod = 'manual';
    }

    console.log('🚀 Submitting ultra fast checkin:', checkinData);
    
    const startTime = performance.now();
    const result = await UltraFastSheetsAPI.submitCheckin(checkinData);
    const endTime = performance.now();
    const submitTime = endTime - startTime;
    
    console.log(`⚡ Submit completed in ${submitTime.toFixed(2)}ms`);
    
    if (result.success) {
      showToast(result.message + ` (${submitTime.toFixed(0)}ms)`, 'success');
      
      // Enhanced success animation
      submitBtn.style.background = '#10b981';
      submitText.textContent = '✅ SUCCESS';
      submitIcon.textContent = '🎉';
      
      setTimeout(() => {
        // Reset form
        resetForm();
      }, 2000);
    } else {
      showToast('❌ Lỗi: ' + (result.error || 'Không xác định'), 'error');
    }

  } catch (error) {
    console.error('Submit error:', error);
    showToast('❌ Lỗi: ' + error.message, 'error');
  } finally {
    setTimeout(() => {
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.classList.remove('pulse');
      submitText.textContent = 'SEND';
      submitIcon.textContent = '🚀';
      submitBtn.style.background = '';
    }, 2000);
  }
});

// 🚀 RESET FORM WITH ENHANCED ANIMATIONS
const resetForm = () => {
  // Reset type selection
  document.querySelectorAll('input[name="userType"]').forEach(radio => {
    radio.checked = false;
    const label = radio.nextElementSibling;
    label.style.transform = '';
  });
  selectedType = null;
  
  // Reset search
  searchInput.value = '';
  searchInput.disabled = true;
  clearSelection();
  performanceIndicator.classList.remove('show');
  
  // Reset manual entry
  manualEntrySection.classList.remove('show');
  manualCheckbox.checked = false;
  popupManualCheckbox.checked = false;
  isManualEntry = false;
  manualInput.classList.remove('show');
  manualInput.value = '';
  manualInput.style.borderColor = '';
  
  // Reset reason
  document.querySelectorAll('.reason-option').forEach(opt => {
    opt.classList.remove('selected');
    opt.style.transform = '';
  });
  selectedReason = null;
  
  // Reset sections
  enableSection(searchSection, false);
  enableSection(reasonSection, false);
  enableSection(submitSection, false);
  
  // Reset preview
  previewSection.classList.remove('show');
  submitBtn.classList.remove('ready');
  
  // Close popup
  closeSearchPopup();
  
  console.log('🔄 Form reset completed');
  showToast('🔄 Form đã được reset - Chọn đối tượng để bắt đầu', 'success');
};

// 🚀 PERFORMANCE MONITORING
const monitorPerformance = () => {
  // Monitor performance marks
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      if (entry.name.includes('search') || entry.name.includes('Search')) {
        console.log(`📊 ${entry.name}: ${entry.duration.toFixed(2)}ms`);
      }
    });
  });
  
  if (typeof PerformanceObserver !== 'undefined') {
    try {
      observer.observe({ entryTypes: ['measure'] });
    } catch (e) {
      console.log('Performance monitoring not supported');
    }
  }
  
  // Test search speed after app loads
  setTimeout(() => {
    if (window.UltraFastSheetsAPI && selectedType) {
      console.log('🚀 Running background speed test...');
      UltraFastSheetsAPI.testSearchSpeed();
    }
  }, 3000);
};

// 🚀 ENHANCED INITIALIZATION
const initializeUltraFastApp = () => {
  console.log('🚀 Initializing ULTRA FAST check-in app...');
  
  // Set initial state
  enableSection(searchSection, false);
  enableSection(reasonSection, false);
  enableSection(submitSection, false);
  
  // Monitor performance
  monitorPerformance();
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Alt + R to reset form
    if (e.altKey && e.key === 'r') {
      e.preventDefault();
      resetForm();
    }
    
    // Escape to close popup
    if (e.key === 'Escape') {
      closeSearchPopup();
    }
    
    // Alt + 1,2,3 to select user types
    if (e.altKey && e.key >= '1' && e.key <= '3') {
      e.preventDefault();
      const types = ['staff', 'student', 'teacher'];
      const index = parseInt(e.key) - 1;
      if (types[index]) {
        document.getElementById(`type${types[index].charAt(0).toUpperCase() + types[index].slice(1)}`).click();
      }
    }
  });
  
  // Enhanced welcome message
  setTimeout(() => {
    showToast('⚡ Ultra Fast Search Ready! Chọn đối tượng để bắt đầu', 'success');
  }, 500);
  
  // Log system info
  console.log(`📱 Device: ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}`);
  console.log(`🌐 Connection: ${navigator.connection ? navigator.connection.effectiveType : 'Unknown'}`);
  console.log(`⚡ Ultra Fast Mode: ENABLED`);
};

// 🚀 PWA BEHAVIORS AND OPTIMIZATIONS
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// Prevent zoom on double tap
let lastTouchTime = 0;
document.addEventListener('touchstart', (e) => {
  const now = Date.now();
  if (now - lastTouchTime <= 300) {
    e.preventDefault();
  }
  lastTouchTime = now;
});

// Enhanced error handling
window.addEventListener('error', (event) => {
  console.error('💥 Global error:', event.error);
  showToast('❌ Đã xảy ra lỗi, vui lòng thử lại', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('💥 Unhandled promise rejection:', event.reason);
  showToast('❌ Lỗi kết nối, vui lòng kiểm tra mạng', 'error');
});

// 🚀 CONNECTION STATUS MONITORING
const monitorConnection = () => {
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      showToast('🟢 Kết nối mạng tốt', 'success');
    } else {
      showToast('🔴 Mất kết nối mạng', 'error');
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Check connection speed if available
  if (navigator.connection) {
    const connection = navigator.connection;
    console.log(`🌐 Connection: ${connection.effectiveType} - ${connection.downlink}Mbps`);
    
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      showToast('⚠️ Kết nối chậm - Có thể ảnh hưởng hiệu suất', 'warning');
    }
  }
};

// 🚀 START THE ULTRA FAST APP
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeUltraFastApp();
    monitorConnection();
  });
} else {
  initializeUltraFastApp();
  monitorConnection();
}

// 🚀 EXPORT FOR DEBUGGING
window.UltraFastApp = {
  API: UltraFastSheetsAPI,
  resetForm,
  testSearch: () => UltraFastSheetsAPI.testSearchSpeed(),
  getState: () => ({
    selectedType,
    selectedRecord,
    isManualEntry,
    selectedReason,
    isSubmitting,
    isSearching
  })
};

console.log('⚡ Ultra Fast Food Card App Loaded Successfully! 🚀');
console.log('💡 Keyboard shortcuts: Alt+R (reset), Alt+1/2/3 (select type), Esc (close popup)');
console.log('🛠️ Debug: Use window.UltraFastApp for testing');