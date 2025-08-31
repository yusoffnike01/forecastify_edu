import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HelpScreen = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    {
      id: 'overview',
      title: '📊 Overview',
      icon: '📖',
      content: {
        title: 'Welcome to Forecastify EDU',
        description: 'Your comprehensive educational tool for learning supply chain forecasting techniques.',
        points: [
          'Interactive forecasting calculations with step-by-step explanations',
          'Real-time data visualization and chart generation',
          'Export capabilities for reports and presentations',
          'Educational focus on supply chain management fundamentals'
        ]
      }
    },
    {
      id: 'getting-started',
      title: '🚀 Getting Started',
      icon: '▶️',
      content: {
        title: 'How to Start Forecasting',
        description: 'Follow these simple steps to begin your forecasting journey:',
        steps: [
          {
            step: 1,
            title: 'Enter Historical Data',
            description: 'Input your past sales data in the Historical Sales Data table.',
            details: 'Add years and corresponding sales figures. You can modify existing data or add new rows as needed.'
          },
          {
            step: 2,
            title: 'Set Forecasting Parameters',
            description: 'Define your future growth expectations and target years.',
            details: 'Enter percentage growth rates for each future year you want to forecast.'
          },
          {
            step: 3,
            title: 'Calculate Forecast',
            description: 'Click the "Calculate Forecast" button to generate predictions.',
            details: 'The system will process your data and generate comprehensive forecasting results.'
          },
          {
            step: 4,
            title: 'Analyze Results',
            description: 'Review charts, statistics, and detailed calculations.',
            details: 'Examine the visual charts and statistical summaries to understand the forecast trends.'
          }
        ]
      }
    },
    {
      id: 'calculations',
      title: '🧮 Calculations',
      icon: '🔢',
      content: {
        title: 'Understanding the Calculations',
        description: 'Learn about the mathematical formulas used in forecasting:',
        formulas: [
          {
            name: 'Basic Forecast Formula',
            formula: 'Forecasted Sales = Previous Year Sales × (1 + Percentage Change)',
            example: 'If 2023 sales = 1000 units and growth = 10%, then 2024 forecast = 1000 × 1.10 = 1100 units'
          },
          {
            name: 'Growth Rate Calculation',
            formula: 'Growth Rate = ((Current Year - Previous Year) / Previous Year) × 100',
            example: 'Growth from 1000 to 1200 = ((1200 - 1000) / 1000) × 100 = 20%'
          },
          {
            name: 'Average Growth Rate',
            formula: 'Average Growth = Sum of All Growth Rates / Number of Periods',
            example: 'For growth rates of 10%, 15%, 20%: Average = (10 + 15 + 20) / 3 = 15%'
          },
          {
            name: 'Projected Growth',
            formula: 'Projected Growth = ((First Forecasted - Last Historical) / Last Historical) × 100',
            example: 'From 1600 (last historical) to 1760 (first forecast) = ((1760 - 1600) / 1600) × 100 = 10%'
          }
        ]
      }
    },
    {
      id: 'features',
      title: '⚡ Features',
      icon: '🛠️',
      content: {
        title: 'Platform Features',
        description: 'Explore all the powerful features available:',
        features: [
          {
            name: 'Interactive Data Tables',
            description: 'Edit historical data and forecasting parameters directly in user-friendly tables.',
            icon: '📋'
          },
          {
            name: 'Multiple Chart Types',
            description: 'Choose from Line, Bar, or Area charts to visualize your data effectively.',
            icon: '📈'
          },
          {
            name: 'Export Capabilities',
            description: 'Export your results as PDF reports or Excel spreadsheets for presentations.',
            icon: '📄'
          },
          {
            name: 'Real-time Calculations',
            description: 'Instant calculation processing with immediate results and feedback.',
            icon: '⚡'
          },
          {
            name: 'Educational Display',
            description: 'Step-by-step calculation breakdowns to enhance learning and understanding.',
            icon: '🎓'
          },
          {
            name: 'User Management',
            description: 'Manage user accounts and access controls for educational institutions.',
            icon: '👥'
          },
          {
            name: 'Currency Conversion',
            description: 'Multi-currency support with live exchange rates for global financial analysis.',
            icon: '💱'
          }
        ]
      }
    },
    {
      id: 'currency',
      title: '💱 Currency Conversion',
      icon: '💰',
      content: {
        title: 'Currency Conversion Features',
        description: 'Learn how to use the multi-currency support for global analysis:',
        features: [
          {
            name: 'Default Currency: Malaysian Ringgit (RM)',
            description: 'All input values are in MYR by default. This is the base currency for calculations.',
            icon: '🇲🇾',
            details: 'When you enter sales data (e.g., 1000), it represents RM 1,000 in value.'
          },
          {
            name: 'Live Exchange Rates',
            description: 'Real-time currency conversion using live API data from international markets.',
            icon: '🌐',
            details: 'Exchange rates update automatically when you load the page. Click the 💱 button to refresh rates.'
          },
          {
            name: 'Supported Currencies',
            description: 'Convert your forecast results to 8 major global currencies.',
            icon: '💹',
            details: 'USD ($), EUR (€), GBP (£), JPY (¥), MYR (RM), SGD (S$), AUD (A$), CAD (C$)'
          },
          {
            name: 'Chart vs Results Display',
            description: 'Charts show original units, while results tables show converted currency values.',
            icon: '📊',
            details: 'Chart: Shows 1,000 units (unchanged). Results: Shows RM 1,000 → $220 (converted).'
          }
        ],
        howToUse: [
          {
            step: 1,
            title: 'Enter Data in RM',
            description: 'Input your historical sales values in Malaysian Ringgit (default currency).'
          },
          {
            step: 2,
            title: 'Select Target Currency',
            description: 'Choose your preferred currency from the dropdown menu next to Chart Type.'
          },
          {
            step: 3,
            title: 'View Converted Results',
            description: 'Results tables automatically show converted values while charts show original units.'
          },
          {
            step: 4,
            title: 'Refresh Exchange Rates',
            description: 'Click the 💱 button to get the latest exchange rates from live market data.'
          }
        ]
      }
    },
    {
      id: 'troubleshooting',
      title: '🔧 Troubleshooting',
      icon: '❗',
      content: {
        title: 'Common Issues & Solutions',
        description: 'Quick fixes for common problems:',
        issues: [
          {
            problem: 'Calculation not working',
            solution: 'Ensure all historical data fields are filled with valid numbers. Check that forecast parameters contain realistic percentage values.',
            icon: '❌'
          },
          {
            problem: 'Chart not displaying',
            solution: 'Try refreshing the page or switching between different chart types (Line, Bar, Area) to resolve display issues.',
            icon: '📊'
          },
          {
            problem: 'Export failed',
            solution: 'Make sure you have calculated results before attempting to export. Try using Excel export if PDF export fails.',
            icon: '📁'
          },
          {
            problem: 'Data validation errors',
            solution: 'Check that years are in correct chronological order and sales values are positive numbers.',
            icon: '⚠️'
          },
          {
            problem: 'Performance issues',
            solution: 'Close other browser tabs and ensure you have a stable internet connection for optimal performance.',
            icon: '🐌'
          },
          {
            problem: 'Currency conversion not working',
            solution: 'Check your internet connection and try clicking the 💱 refresh button to update exchange rates. If problem persists, the default rates will be used.',
            icon: '💱'
          },
          {
            problem: 'Exchange rates seem outdated',
            solution: 'Click the 💱 button next to the currency selector to fetch the latest live exchange rates from the API.',
            icon: '🔄'
          }
        ]
      }
    }
  ];

  const currentSection = sections.find(section => section.id === activeSection);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative',
      padding: '2rem'
    }}>
      
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />
      
      {/* Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '0 auto'
      }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            style={{ 
              fontSize: '3rem', 
              marginBottom: '0.8rem',
              background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            💡
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: '800',
              marginBottom: '0.8rem',
              background: 'linear-gradient(135deg, #1a202c 0%, #4a5568 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.2'
            }}
          >
            Help & Documentation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              fontSize: '1rem',
              color: '#4a5568',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.5'
            }}
          >
            Learn how to use Forecastify EDU for supply chain forecasting and analysis
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '2rem',
          alignItems: 'start'
        }}>
          
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              position: 'sticky',
              top: '2rem'
            }}
          >
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              📚 Help Topics
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    background: activeSection === section.id 
                      ? 'linear-gradient(135deg, #059669 0%, #0d9488 100%)'
                      : 'transparent',
                    color: activeSection === section.id ? 'white' : '#4a5568',
                    boxShadow: activeSection === section.id 
                      ? '0 4px 20px rgba(5, 150, 105, 0.3)'
                      : 'none'
                  }}
                >
                  <span style={{ marginRight: '8px' }}>{section.icon}</span>
                  {section.title.replace(/^[📊🚀🧮⚡🔧]\s/, '')}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              minHeight: '600px'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Section Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '2rem',
                  paddingBottom: '1rem',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                    color: 'white',
                    width: '50px',
                    height: '50px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {currentSection.icon}
                  </div>
                  <div>
                    <h2 style={{
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: '#1a202c',
                      margin: 0
                    }}>
                      {currentSection.content.title}
                    </h2>
                    <p style={{
                      fontSize: '1rem',
                      color: '#4a5568',
                      margin: '4px 0 0 0'
                    }}>
                      {currentSection.content.description}
                    </p>
                  </div>
                </div>

                {/* Section Content */}
                <div style={{ fontSize: '1rem', lineHeight: '1.7', color: '#374151' }}>
                  {/* Overview Section */}
                  {activeSection === 'overview' && (
                    <div>
                      <ul style={{ paddingLeft: '1.5rem' }}>
                        {currentSection.content.points.map((point, index) => (
                          <li key={index} style={{ marginBottom: '0.5rem' }}>
                            <strong>•</strong> {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Getting Started Section */}
                  {activeSection === 'getting-started' && (
                    <div>
                      {currentSection.content.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '0.5rem'
                          }}>
                            <div style={{
                              background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                              color: 'white',
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: '700'
                            }}>
                              {step.step}
                            </div>
                            <h4 style={{
                              fontSize: '1.2rem',
                              fontWeight: '600',
                              color: '#1a202c',
                              margin: 0
                            }}>
                              {step.title}
                            </h4>
                          </div>
                          <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>
                            {step.description}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                            {step.details}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Calculations Section */}
                  {activeSection === 'calculations' && (
                    <div>
                      {currentSection.content.formulas.map((formula, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          <h4 style={{
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            color: '#1a202c',
                            marginBottom: '0.5rem'
                          }}>
                            {formula.name}
                          </h4>
                          <div style={{
                            background: '#1a202c',
                            color: '#10b981',
                            padding: '12px',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            marginBottom: '0.5rem'
                          }}>
                            {formula.formula}
                          </div>
                          <p style={{
                            margin: 0,
                            fontSize: '0.9rem',
                            color: '#6b7280',
                            fontStyle: 'italic'
                          }}>
                            <strong>Example:</strong> {formula.example}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Features Section */}
                  {activeSection === 'features' && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '1rem'
                    }}>
                      {currentSection.content.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{
                            fontSize: '2.5rem',
                            marginBottom: '1rem'
                          }}>
                            {feature.icon}
                          </div>
                          <h4 style={{
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: '#1a202c',
                            marginBottom: '0.5rem'
                          }}>
                            {feature.name}
                          </h4>
                          <p style={{
                            margin: 0,
                            fontSize: '0.9rem',
                            color: '#6b7280'
                          }}>
                            {feature.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Currency Section */}
                  {activeSection === 'currency' && (
                    <div>
                      {/* Currency Features */}
                      <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        color: '#1a202c',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        💰 Currency Features
                      </h3>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1rem',
                        marginBottom: '2rem'
                      }}>
                        {currentSection.content.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                              borderRadius: '16px',
                              padding: '1.5rem',
                              border: '1px solid #0284c7',
                              textAlign: 'center'
                            }}
                          >
                            <div style={{
                              fontSize: '2rem',
                              marginBottom: '0.5rem'
                            }}>
                              {feature.icon}
                            </div>
                            <h4 style={{
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: '#0c4a6e',
                              marginBottom: '0.5rem'
                            }}>
                              {feature.name}
                            </h4>
                            <p style={{
                              margin: '0 0 0.5rem 0',
                              fontSize: '0.85rem',
                              color: '#075985'
                            }}>
                              {feature.description}
                            </p>
                            <p style={{
                              margin: 0,
                              fontSize: '0.8rem',
                              color: '#0369a1',
                              fontStyle: 'italic'
                            }}>
                              {feature.details}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      {/* How to Use Currency */}
                      <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        color: '#1a202c',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        📝 How to Use Currency Conversion
                      </h3>
                      
                      {currentSection.content.howToUse.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{
                            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            marginBottom: '1rem',
                            border: '1px solid #16a34a'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '0.5rem'
                          }}>
                            <div style={{
                              background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                              color: 'white',
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: '700'
                            }}>
                              {step.step}
                            </div>
                            <h4 style={{
                              fontSize: '1.1rem',
                              fontWeight: '600',
                              color: '#14532d',
                              margin: 0
                            }}>
                              {step.title}
                            </h4>
                          </div>
                          <p style={{
                            margin: 0,
                            fontSize: '0.9rem',
                            color: '#166534',
                            paddingLeft: '42px'
                          }}>
                            {step.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Troubleshooting Section */}
                  {activeSection === 'troubleshooting' && (
                    <div>
                      {currentSection.content.issues.map((issue, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{
                            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            border: '1px solid #f59e0b'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px'
                          }}>
                            <div style={{ fontSize: '1.5rem', minWidth: '30px' }}>
                              {issue.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: '#92400e',
                                marginBottom: '0.5rem'
                              }}>
                                Problem: {issue.problem}
                              </h4>
                              <p style={{
                                margin: 0,
                                fontSize: '0.9rem',
                                color: '#78350f'
                              }}>
                                <strong>Solution:</strong> {issue.solution}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default HelpScreen;