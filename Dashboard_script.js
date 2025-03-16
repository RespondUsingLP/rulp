// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initSidebar();
    initDarkMode();
    initChatWidget();
    initCharts();
    initSearchFunctionality();
    initNavigationLinks();
    initLanguageSelector();
    initAccessibilityButtons();
    initNotifications();
    initFeedbackEditor();
    initDateTimeUpdates();

    // Initialize any form elements and buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', handleButtonClick);
    });
});

// ======== SIDEBAR FUNCTIONS ========
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const mainContent = document.querySelector('.main-content');

    // Toggle sidebar on menu button click
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Sidebar collapse functionality
    const sidebarCollapseBtn = document.createElement('button');
    sidebarCollapseBtn.className = 'btn-icon sidebar-collapse';
    sidebarCollapseBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    sidebarCollapseBtn.style.position = 'absolute';
    sidebarCollapseBtn.style.right = '-15px';
    sidebarCollapseBtn.style.top = '70px';
    sidebarCollapseBtn.style.zIndex = '101';
    sidebarCollapseBtn.style.backgroundColor = 'var(--dark-color)';
    sidebarCollapseBtn.style.color = 'white';
    sidebar.appendChild(sidebarCollapseBtn);

    sidebarCollapseBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');

        // Update icon based on state
        const icon = this.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            icon.className = 'fas fa-chevron-right';
        } else {
            icon.className = 'fas fa-chevron-left';
        }
    });
}

// ======== DARK MODE FUNCTIONS ========
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.checked = true;
    }

    // Listen for toggle changes
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode');

            // Save preference
            const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);

            // Redraw charts if they exist
            updateChartsForTheme();
        });
    }
}

// ======== CHAT WIDGET FUNCTIONS ========
function initChatWidget() {
    const chatWidget = document.getElementById('chat-widget');
    const chatHeader = document.getElementById('chat-header');
    const minimizeBtn = document.getElementById('minimize-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input-field');
    const sendButton = document.getElementById('send-message');
    const voiceButton = document.getElementById('voice-input');

    // Minimize/restore chat functionality
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function() {
            chatWidget.classList.toggle('collapsed');
            const icon = this.querySelector('i');
            if (chatWidget.classList.contains('collapsed')) {
                icon.className = 'fas fa-expand';
            } else {
                icon.className = 'fas fa-minus';
            }
        });
    }

    // Chat header can also toggle the widget
    if (chatHeader) {
        chatHeader.addEventListener('click', function(e) {
            // Only toggle if clicking directly on the header (not on buttons within it)
            if (e.target === chatHeader || e.target.parentNode === chatHeader || e.target === chatHeader.querySelector('.chat-title') || e.target.parentNode === chatHeader.querySelector('.chat-title')) {
                chatWidget.classList.toggle('collapsed');
            }
        });
    }

    // Send message functionality
    if (sendButton && chatInput) {
        sendButton.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    // Voice input simulation
    if (voiceButton) {
        voiceButton.addEventListener('click', function() {
            // Visual feedback for voice activation
            this.classList.add('active');
            this.querySelector('i').style.color = 'var(--danger-color)';

            // Show a temporary message
            const tempElement = document.createElement('div');
            tempElement.textContent = "Listening...";
            tempElement.className = "temp-voice-indicator";
            tempElement.style.padding = "0.5rem";
            tempElement.style.borderRadius = "4px";
            tempElement.style.backgroundColor = "var(--primary-light)";
            tempElement.style.color = "var(--primary-color)";
            tempElement.style.textAlign = "center";
            tempElement.style.margin = "0.5rem 0";
            chatMessages.appendChild(tempElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Simulate voice processing after a delay
            setTimeout(() => {
                this.classList.remove('active');
                this.querySelector('i').style.color = '';
                chatMessages.removeChild(tempElement);

                // Simulate recognized text
                chatInput.value = "How do I create a new assignment?";
                // Optionally auto-send the "recognized" text
                // sendChatMessage();
            }, 2000);
        });
    }

    // Function to handle sending messages
    function sendChatMessage() {
        if (!chatInput.value.trim()) return;

        const messageText = chatInput.value.trim();
        chatInput.value = '';

        // Add user message to chat
        addMessageToChat('user', messageText);

        // Simulate AI response after a short delay
        setTimeout(() => {
            let botResponse;

            // Simple response logic based on keywords
            if (messageText.toLowerCase().includes('assignment')) {
                botResponse = "To create or manage assignments, go to the Assignments tab in the sidebar. There you can create new assignments, set due dates, and manage existing ones.";
            } else if (messageText.toLowerCase().includes('grade') || messageText.toLowerCase().includes('feedback')) {
                botResponse = "You can grade assignments by clicking on 'Grade Now' next to any assignment. The AI will provide initial feedback that you can review and adjust before finalizing.";
            } else if (messageText.toLowerCase().includes('student')) {
                botResponse = "Student information can be found in the Students tab. You can view individual progress, review submission history, and send personalized feedback.";
            } else {
                botResponse = "I'm here to help with assignments, grading, student management, and other teaching tasks. What specific assistance do you need with your class?";
            }

            addMessageToChat('bot', botResponse);
        }, 1000);
    }

    // Function to add messages to the chat
    function addMessageToChat(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        contentDiv.appendChild(paragraph);

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';

        // Get current time
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
        timeDiv.textContent = formattedTime;

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ======== CHART FUNCTIONS ========
function initCharts() {
    // Get the chart canvases
    const assignmentChartCanvas = document.getElementById('assignmentChart');
    const progressChartCanvas = document.getElementById('progressChart');
    const studentProgressChartCanvas = document.getElementById('studentProgressChart');

    // Chart configuration options based on current theme
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#f5f5f5' : '#333333';
    const gridColor = isDarkMode ? '#444444' : '#e0e0e0';

    // Create the assignment performance chart
    if (assignmentChartCanvas) {
        const ctx = assignmentChartCanvas.getContext('2d');
        window.assignmentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Literary Analysis', 'Poetry Analysis', 'Short Story', 'Book Report', 'Vocabulary Test'],
                datasets: [{
                    label: 'Average Score',
                    data: [78, 85, 72, 88, 92],
                    backgroundColor: '#4361ee',
                    borderColor: '#3f37c9',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor
                        }
                    },
                    x: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                }
            }
        });
    }

    // Create the student progress chart
    if (progressChartCanvas) {
        const ctx = progressChartCanvas.getContext('2d');
        window.progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Class Average',
                    data: [72, 75, 78, 80, 83, 85],
                    backgroundColor: 'rgba(67, 97, 238, 0.2)',
                    borderColor: '#4361ee',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Top Performers',
                    data: [85, 88, 90, 92, 94, 95],
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    borderColor: '#4caf50',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 100,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor
                        }
                    },
                    x: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                }
            }
        });
    }

    // Create the individual student progress chart
    if (studentProgressChartCanvas) {
        const ctx = studentProgressChartCanvas.getContext('2d');
        window.studentProgressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Feb 15', 'Feb 28', 'Mar 12', 'Mar 14'],
                datasets: [{
                    label: 'Assignment Scores',
                    data: [78, 82, 92, 85],
                    backgroundColor: 'rgba(67, 97, 238, 0.2)',
                    borderColor: '#4361ee',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#4361ee',
                    pointRadius: 5
                },
                {
                    label: 'Class Average',
                    data: [75, 77, 80, 82],
                    backgroundColor: 'rgba(153, 153, 153, 0.2)',
                    borderColor: '#999999',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 100,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor
                        }
                    },
                    x: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                }
            }
        });
    }

    // Update charts when filter changes
    const chartFilter = document.getElementById('chart-filter');
    if (chartFilter) {
        chartFilter.addEventListener('change', function() {
            updateChartsData(this.value);
        });
    }
}
// Update chart data based on selected filter (continued)
function updateChartsData(timeframe) {
    if (window.assignmentChart) {
        let assignmentData;

        switch(timeframe) {
            case 'week':
                assignmentData = [78, 85, 72, 88, 92];
                break;
            case 'month':
                assignmentData = [75, 82, 78, 85, 90];
                break;
            case 'semester':
                assignmentData = [72, 80, 75, 83, 88];
                break;
            default:
                assignmentData = [78, 85, 72, 88, 92];
        }
        
        window.assignmentChart.data.datasets[0].data = assignmentData;
        window.assignmentChart.update();
    }
    
    if (window.progressChart) {
        let classAverage, topPerformers;
        
        switch(timeframe) {
            case 'week':
                classAverage = [72, 75, 78, 80, 83, 85];
                topPerformers = [85, 88, 90, 92, 94, 95];
                break;
            case 'month':
                classAverage = [70, 73, 76, 79, 81, 84];
                topPerformers = [83, 86, 89, 91, 93, 94];
                break;
            case 'semester':
                classAverage = [68, 71, 74, 77, 80, 83];
                topPerformers = [80, 84, 87, 90, 92, 93];
                break;
            default:
                classAverage = [72, 75, 78, 80, 83, 85];
                topPerformers = [85, 88, 90, 92, 94, 95];
        }
        
        window.progressChart.data.datasets[0].data = classAverage;
        window.progressChart.data.datasets[1].data = topPerformers;
        window.progressChart.update();
    }
    
    if (window.studentProgressChart) {
        let studentScores, classAverage;
        
        switch(timeframe) {
            case 'week':
                studentScores = [78, 82, 92, 85];
                classAverage = [75, 77, 80, 82];
                break;
            case 'month':
                studentScores = [75, 80, 88, 83];
                classAverage = [73, 75, 78, 80];
                break;
            case 'semester':
                studentScores = [72, 77, 85, 80];
                classAverage = [70, 73, 76, 78];
                break;
            default:
                studentScores = [78, 82, 92, 85];
                classAverage = [75, 77, 80, 82];
        }
        
        window.studentProgressChart.data.datasets[0].data = studentScores;
        window.studentProgressChart.data.datasets[1].data = classAverage;
        window.studentProgressChart.update();
    }
}

// Update charts for theme changes
function updateChartsForTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#f5f5f5' : '#333333';
    const gridColor = isDarkMode ? '#444444' : '#e0e0e0';
    
    const charts = [
        window.assignmentChart,
        window.progressChart,
        window.studentProgressChart
    ];
    
    charts.forEach(chart => {
        if (chart) {
            // Update axis colors
            if (chart.options.scales.x) {
                chart.options.scales.x.grid.color = gridColor;
                chart.options.scales.x.ticks.color = textColor;
            }
            if (chart.options.scales.y) {
                chart.options.scales.y.grid.color = gridColor;
                chart.options.scales.y.ticks.color = textColor;
            }
            
            // Update legend colors
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            
            chart.update();
        }
    });
}

// ======== SEARCH FUNCTIONALITY ========
function initSearchFunctionality() {
    const searchBar = document.getElementById('search-bar');
    const searchResults = document.getElementById('search-results');
    const searchOverlay = document.getElementById('search-overlay');
    
    if (searchBar) {
        // Show search results when search bar is focused
        searchBar.addEventListener('focus', function() {
            if (searchResults) {
                searchResults.style.display = 'block';
            }
            if (searchOverlay) {
                searchOverlay.style.display = 'block';
            }
        });
        
        // Hide search results when clicking outside
        if (searchOverlay) {
            searchOverlay.addEventListener('click', function() {
                searchResults.style.display = 'none';
                searchOverlay.style.display = 'none';
            });
        }
        
        // Handle search input
        searchBar.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            
            if (query.length > 1) {
                // Simulate search results
                displaySearchResults(query);
            } else if (searchResults) {
                // Clear results if query is too short
                searchResults.innerHTML = '<p class="search-placeholder">Type at least 2 characters to search...</p>';
            }
        });
    }
    
    // Function to display search results
    function displaySearchResults(query) {
        if (!searchResults) return;
        
        // Clear previous results
        searchResults.innerHTML = '';
        
        // Simulate loading state
        searchResults.innerHTML = '<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
        
        // Sample search results
        const sampleResults = [
            { title: 'Literary Analysis Assignment', type: 'assignment', icon: 'fas fa-book', link: '#/assignments/literary' },
            { title: 'Student Progress Report', type: 'report', icon: 'fas fa-chart-line', link: '#/reports/progress' },
            { title: 'Grammar Lessons', type: 'lesson', icon: 'fas fa-chalkboard-teacher', link: '#/lessons/grammar' },
            { title: 'Feedback Templates', type: 'template', icon: 'fas fa-comment-dots', link: '#/templates/feedback' }
        ];
        
        // Filter results based on query
        const filteredResults = sampleResults.filter(result => 
            result.title.toLowerCase().includes(query) || 
            result.type.toLowerCase().includes(query)
        );
        
        // Simulate delay for realism
        setTimeout(() => {
            searchResults.innerHTML = '';
            
            if (filteredResults.length === 0) {
                searchResults.innerHTML = '<p class="search-no-results">No results found for "' + query + '"</p>';
                return;
            }
            
            // Add results to DOM
            filteredResults.forEach(result => {
                const resultItem = document.createElement('a');
                resultItem.href = result.link;
                resultItem.className = 'search-result-item';
                
                resultItem.innerHTML = `
                    <div class="search-result-icon"><i class="${result.icon}"></i></div>
                    <div class="search-result-content">
                        <div class="search-result-title">${result.title}</div>
                        <div class="search-result-type">${result.type}</div>
                    </div>
                    <div class="search-result-action"><i class="fas fa-arrow-right"></i></div>
                `;
                
                searchResults.appendChild(resultItem);
            });
        }, 500);
    }
}

// ======== NAVIGATION FUNCTIONS ========
function initNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get target section id from href
            const targetId = this.getAttribute('href').substring(1);
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link and target section
            this.classList.add('active');
            document.getElementById(targetId)?.classList.add('active');
            
            // Update URL hash
            window.location.hash = targetId;
            
            // Close sidebar on mobile after navigation
            const sidebar = document.getElementById('sidebar');
            if (sidebar && window.innerWidth < 768) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Check URL hash on page load
    window.addEventListener('load', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetLink = document.querySelector(`.nav-link[href="#${hash}"]`);
            if (targetLink) {
                targetLink.click();
            }
        } else {
            // Default to first link if no hash
            const firstLink = document.querySelector('.nav-link');
            if (firstLink) {
                firstLink.click();
            }
        }
    });
}

// ======== LANGUAGE SELECTOR ========
function initLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            const selectedLanguage = this.value;
            
            // Save language preference
            localStorage.setItem('language', selectedLanguage);
            
            // Simulate language change
            showNotification(`Language changed to ${selectedLanguage}`, 'info');
            
            // In a real application, this would trigger a translation process
            // or reload the page with the new language parameter
        });
        
        // Set initial value from localStorage if available
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            languageSelector.value = savedLanguage;
        }
    }
}

// ======== ACCESSIBILITY FUNCTIONS ========
function initAccessibilityButtons() {
    // Text size controls
    const increaseTextBtn = document.getElementById('increase-text');
    const decreaseTextBtn = document.getElementById('decrease-text');
    const resetTextBtn = document.getElementById('reset-text');
    
    let textSizeLevel = parseInt(localStorage.getItem('textSizeLevel') || '0');
    
    // Apply stored text size on page load
    adjustTextSize(0);
    
    if (increaseTextBtn) {
        increaseTextBtn.addEventListener('click', function() {
            if (textSizeLevel < 3) {
                adjustTextSize(1);
            }
        });
    }
    
    if (decreaseTextBtn) {
        decreaseTextBtn.addEventListener('click', function() {
            if (textSizeLevel > -2) {
                adjustTextSize(-1);
            }
        });
    }
    
    if (resetTextBtn) {
        resetTextBtn.addEventListener('click', function() {
            textSizeLevel = 0;
            localStorage.setItem('textSizeLevel', textSizeLevel);
            document.documentElement.style.fontSize = '16px';
        });
    }
    
    function adjustTextSize(change) {
        textSizeLevel += change;
        localStorage.setItem('textSizeLevel', textSizeLevel);
        
        const baseSize = 16; // Default font size in pixels
        const newSize = baseSize + (textSizeLevel * 2);
        document.documentElement.style.fontSize = `${newSize}px`;
    }
    
    // High contrast mode
    const contrastToggle = document.getElementById('contrast-toggle');
    
    if (contrastToggle) {
        // Check for saved preference
        const highContrast = localStorage.getItem('highContrast') === 'true';
        
        if (highContrast) {
            document.body.classList.add('high-contrast');
            contrastToggle.checked = true;
        }
        
        contrastToggle.addEventListener('change', function() {
            document.body.classList.toggle('high-contrast');
            
            // Save preference
            localStorage.setItem('highContrast', this.checked);
            
            // Update charts for high contrast if needed
            if (typeof updateChartsForTheme === 'function') {
                updateChartsForTheme();
            }
        });
    }
}

// ======== NOTIFICATION SYSTEM ========
function initNotifications() {
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Initialize notification buttons
    const notificationBtns = document.querySelectorAll('[data-notification]');
    
    notificationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const message = this.getAttribute('data-notification');
            const type = this.getAttribute('data-notification-type') || 'info';
            
            showNotification(message, type);
        });
    });
    
    // Sample notifications on load
    setTimeout(() => {
        showNotification('Welcome to the AI Grading Assistant Dashboard', 'success');
    }, 1000);
}


function showNotification(message, type = 'info', duration = 5000) {
    const notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.backgroundColor = getNotificationColor(type);
    notification.style.color = '#fff';
    notification.style.padding = '12px 20px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.transition = 'all 0.3s ease';
    notification.style.cursor = 'pointer';
    notification.style.display = 'flex';
    notification.style.justifyContent = 'space-between';
    notification.style.alignItems = 'center';
    
    // Icon based on notification type
    const iconClass = getNotificationIcon(type);
    
    notification.innerHTML = `
        <div>
            <i class="${iconClass}" style="margin-right: 10px;"></i>
            ${message}
        </div>
        <button class="notification-close" style="background: none; border: none; color: #fff; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Add click event to close button
    notification.querySelector('.notification-close').addEventListener('click', function(e) {
        e.stopPropagation();
        closeNotification(notification);
    });
    
    // Click anywhere on notification to close
    notification.addEventListener('click', function() {
        closeNotification(notification);
    });
    
    // Auto-close after duration
    setTimeout(() => {
        if (notification.parentNode === notificationContainer) {
            closeNotification(notification);
        }
    }, duration);
    
    return notification;
}

// Close notification with animation
function closeNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(30px)';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Get notification color based on type
function getNotificationColor(type) {
    switch(type.toLowerCase()) {
        case 'success':
            return '#4caf50';
        case 'error':
            return '#f44336';
        case 'warning':
            return '#ff9800';
        case 'info':
        default:
            return '#2196f3';
    }
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch(type.toLowerCase()) {
        case 'success':
            return 'fas fa-check-circle';
        case 'error':
            return 'fas fa-exclamation-circle';
        case 'warning':
            return 'fas fa-exclamation-triangle';
        case 'info':
        default:
            return 'fas fa-info-circle';
    }
}

// ======== FEEDBACK EDITOR ========
function initFeedbackEditor() {
    const feedbackEditor = document.getElementById('feedback-editor');
    const feedbackPreview = document.getElementById('feedback-preview');
    const saveTemplateBtn = document.getElementById('save-template');
    const templateSelector = document.getElementById('template-selector');
    
    if (feedbackEditor && feedbackPreview) {
        // Update preview as user types
        feedbackEditor.addEventListener('input', function() {
            updateFeedbackPreview();
        });
        
        // Insert AI suggestion
        const suggestBtn = document.getElementById('suggest-feedback');
        if (suggestBtn) {
            suggestBtn.addEventListener('click', function() {
                // Simulate AI suggestion
                const suggestions = [
                    "Your analysis shows good understanding of the text's themes. Consider exploring how the author's background influences these themes for deeper insights.",
                    "Well-structured argument with clear evidence. To strengthen your analysis, try connecting your observations to broader literary movements of the period.",
                    "Your writing demonstrates strong critical thinking. For future improvement, consider incorporating more varied sentence structures to enhance readability."
                ];
                
                // Pick a random suggestion
                const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
                
                // Insert at cursor position or append
                insertAtCursor(feedbackEditor, suggestion);
                
                updateFeedbackPreview();
                showNotification('AI suggestion added', 'success');
            });
        }
        
        // Save as template
        if (saveTemplateBtn) {
            saveTemplateBtn.addEventListener('click', function() {
                const templateName = prompt('Enter a name for this feedback template:');
                
                if (templateName && templateName.trim()) {
                    // Get existing templates or initialize empty array
                    let templates = JSON.parse(localStorage.getItem('feedbackTemplates') || '[]');
                    
                    // Add new template
                    templates.push({
                        name: templateName.trim(),
                        content: feedbackEditor.value
                    });
                    
                    // Save to localStorage
                    localStorage.setItem('feedbackTemplates', JSON.stringify(templates));
                    
                    // Update template selector
                    updateTemplateSelector();
                    
                    showNotification('Template saved successfully', 'success');
                }
            });
        }
        
        // Load template
        if (templateSelector) {
            // Initial population of selector
            updateTemplateSelector();
            
            templateSelector.addEventListener('change', function() {
                const selectedValue = this.value;
                
                if (selectedValue) {
                    // Get templates
                    const templates = JSON.parse(localStorage.getItem('feedbackTemplates') || '[]');
                    
                    // Find selected template
                    const template = templates.find(t => t.name === selectedValue);
                    
                    if (template) {
                        // Confirm before overwriting current content
                        if (feedbackEditor.value.trim() && !confirm('This will replace your current feedback text. Continue?')) {
                            this.value = '';
                            return;
                        }
                        
                        // Load template content
                        feedbackEditor.value = template.content;
                        updateFeedbackPreview();
                    }
                }
            });
        }
        
        // Initial preview update
        updateFeedbackPreview();
    }
    
    // Function to update template selector
    function updateTemplateSelector() {
        if (!templateSelector) return;
        
        // Clear existing options except placeholder
        while (templateSelector.options.length > 1) {
            templateSelector.remove(1);
        }
        
        // Get templates
        const templates = JSON.parse(localStorage.getItem('feedbackTemplates') || '[]');
        
        // Add template options
        templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.name;
            option.textContent = template.name;
            templateSelector.appendChild(option);
        });
    }
    
    // Function to update preview
    function updateFeedbackPreview() {
        if (!feedbackEditor || !feedbackPreview) return;
        
        // Convert line breaks to HTML breaks
        let formattedText = feedbackEditor.value
            .replace(/\n/g, '<br>')
            // Bold text between asterisks
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic text between underscores
            .replace(/_(.*?)_/g, '<em>$1</em>');
            
        feedbackPreview.innerHTML = formattedText;
    }
    
    // Function to insert text at cursor position
    function insertAtCursor(textarea, text) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        
        // Insert text at cursor position with a space before if needed
        const spaceBefore = startPos > 0 && 
                           textarea.value.charAt(startPos - 1) !== ' ' && 
                           textarea.value.charAt(startPos - 1) !== '\n' ? ' ' : '';
                           
        const spaceAfter = endPos < textarea.value.length && 
                           textarea.value.charAt(endPos) !== ' ' && 
                           textarea.value.charAt(endPos) !== '\n' ? ' ' : '';
                           
        textarea.value = textarea.value.substring(0, startPos) + 
                         spaceBefore + text + spaceAfter + 
                         textarea.value.substring(endPos);
                         
        // Move cursor to end of inserted text
        const newPos = startPos + spaceBefore.length + text.length + spaceAfter.length;
        textarea.setSelectionRange(newPos, newPos);
        textarea.focus();
    }
}

// ======== DATE & TIME UPDATES ========
function initDateTimeUpdates() {
    const dateElements = document.querySelectorAll('.current-date');
    const timeElements = document.querySelectorAll('.current-time');
    
    // Update current date
    if (dateElements.length > 0) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const currentDate = new Date().toLocaleDateString(undefined, options);
        
        dateElements.forEach(el => {
            el.textContent = currentDate;
        });
    }
    
    // Update current time and set interval
    if (timeElements.length > 0) {
        updateTime();
        setInterval(updateTime, 30000); // Update every 30 seconds
    }
    
    // Update deadline countdowns
    const deadlineElements = document.querySelectorAll('[data-deadline]');
    
    if (deadlineElements.length > 0) {
        updateDeadlines();
        setInterval(updateDeadlines, 60000); // Update every minute
    }
    
    // Function to update time
    function updateTime() {
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        const currentTime = new Date().toLocaleTimeString(undefined, options);
        
        timeElements.forEach(el => {
            el.textContent = currentTime;
        });
    }
    
    // Function to update deadlines
    function updateDeadlines() {
        deadlineElements.forEach(el => {
            const deadlineStr = el.getAttribute('data-deadline');
            const deadline = new Date(deadlineStr);
            const now = new Date();
            
            // Get time difference in milliseconds
            const diff = deadline - now;
            
            // Skip if deadline has passed
            if (diff <= 0) {
                el.textContent = 'Expired';
                el.classList.add('expired');
                return;
            }
            
            // Calculate remaining time
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            // Format the countdown text
            let countdownText = '';
            
            if (days > 0) {
                countdownText += `${days}d `;
            }
            
            countdownText += `${hours}h ${minutes}m`;
            
            // Update element
            el.textContent = countdownText;
            
            // Add urgency class if less than 24 hours
            if (diff < (1000 * 60 * 60 * 24)) {
                el.classList.add('urgent');
            } else {
                el.classList.remove('urgent');
            }
        });
    }
}

// ======== BUTTON CLICK HANDLER ========
function handleButtonClick(e) {
    const btn = e.currentTarget;
    
    // Get button action from data attribute
    const action = btn.getAttribute('data-action');
    
    if (!action) return;
    
    // Handle different button actions
    switch(action) {
        case 'grade':
            // Handle grade button click
            const assignmentId = btn.getAttribute('data-id');
            showNotification(`Starting AI-assisted grading for assignment #${assignmentId}`, 'info');
            
            // In a real application, this would navigate to the grading interface
            simulateLoading(btn, 'Preparing...');
            break;
            
        case 'export':
            // Handle export button click
            const format = btn.getAttribute('data-format') || 'csv';
            exportData(format);
            break;
            
        case 'publish':
            // Handle publish button click
            const targetId = btn.getAttribute('data-target');
            publishFeedback(targetId, btn);
            break;
            
        case 'refresh':
            // Handle refresh button click
            const section = btn.closest('.widget') || btn.closest('.content-section');
            refreshSection(section, btn);
            break;
            
        default:
            // For other buttons, just show a notification
            showNotification(`Button clicked: ${btn.textContent}`, 'info');
    }
}

// Function to simulate loading state on buttons
function simulateLoading(button, loadingText = 'Loading...') {
    const originalContent = button.innerHTML;
    const originalDisabled = button.disabled;
    
    // Disable button and show loading state
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
    
    // Simulate operation completion after delay
    setTimeout(() => {
        button.disabled = originalDisabled;
        button.innerHTML = originalContent;
    }, 2000);
}

// Function to export data
function exportData(format) {
    showNotification(`Exporting data in ${format.toUpperCase()} format...`, 'info');
    
    // Simulate export process
    setTimeout(() => {
        showNotification(`Data exported successfully as ${format.toUpperCase()}`, 'success');
    }, 1500);
}

// Function to publish feedback
function publishFeedback(targetId, button) {
    simulateLoading(button, 'Publishing...');
    
    // Simulate publish process
    setTimeout(() => {
        showNotification(`Feedback published to student #${targetId}`, 'success');
        
        // Update button state
        button.textContent = 'Published';
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        button.disabled = true;
    }, 2000);
}

// Function to refresh a section
function refreshSection(section, button) {
    if (!section) return;
    
    simulateLoading(button, 'Refreshing...');
    
    // Add refresh animation to section
    section.style.opacity = '0.6';
    
    // Simulate refresh process
    setTimeout(() => {
        section.style.opacity = '1';
        showNotification('Data refreshed successfully', 'success');
    }, 1500);
}
