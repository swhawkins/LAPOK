import { useState, useEffect } from 'react'
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Download, 
  FileText,
  Loader2
} from 'lucide-react'

interface Question {
  id: number
  text: string
  answer: boolean | null
}

function OklahomaLAPApp() {
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: "Has he/she ever used a weapon against you or threatened you with a weapon?", answer: null },
    { id: 2, text: "Has he/she threatened to kill you or your children?", answer: null },
    { id: 3, text: "Do you think he/she might try to kill you?", answer: null },
    { id: 4, text: "Has he/she ever tried to choke you?", answer: null },
    { id: 5, text: "Is he/she violently or constantly jealous or does he/she control most of your daily activities?", answer: null },
    { id: 6, text: "Have you left him/her after living together during the past year?", answer: null },
    { id: 7, text: "Is he/she unemployed?", answer: null },
    { id: 8, text: "Has he/she ever tried to kill himself/herself?", answer: null },
    { id: 9, text: "Do you have a child that he/she knows is not his/hers?", answer: null },
    { id: 10, text: "Does he/she follow or spy on you, leave threatening notes, destroy your property, or call you when you don't want him/her to?", answer: null },
    { id: 11, text: "Has he/she ever forced you to have sex when you didn't wish to?", answer: null },
    { id: 12, text: "Does he/she abuse drugs or alcohol?", answer: null },
    { id: 13, text: "Is he/she an ex-husband/ex-wife or ex-boyfriend/ex-girlfriend?", answer: null },
    { id: 14, text: "Does he/she have access to a gun?", answer: null },
    { id: 15, text: "Is there anything else that makes you afraid for your safety?", answer: null }
  ])

  const [isGenerating, setIsGenerating] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  // Load saved answers from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem('lapAnswers')
    if (savedAnswers) {
      setQuestions(JSON.parse(savedAnswers))
    }
  }, [])

  // Save answers to localStorage when they change
  useEffect(() => {
    localStorage.setItem('lapAnswers', JSON.stringify(questions))
  }, [questions])

  // Handle PWA install prompt
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    })
  }, [])

  const handleAnswer = (id: number, answer: boolean) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, answer } : q
    ))
  }

  const getDangerLevel = () => {
    const yesAnswers = questions.filter(q => q.answer === true).length
    if (yesAnswers >= 4) return 'high'
    if (yesAnswers >= 2) return 'medium'
    return 'low'
  }

  const generateReport = async () => {
    setIsGenerating(true)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const dangerLevel = getDangerLevel()
    const report = `Oklahoma LAP Assessment Report\n\n` +
      `Date: ${new Date().toLocaleDateString()}\n` +
      `Time: ${new Date().toLocaleTimeString()}\n\n` +
      `Danger Level: ${dangerLevel.toUpperCase()}\n\n` +
      `Questions Answered:\n` +
      questions.map(q => 
        `${q.id}. ${q.text}\nAnswer: ${q.answer === null ? 'Not Answered' : q.answer ? 'Yes' : 'No'}`
      ).join('\n\n')

    // Create and download text file
    const blob = new Blob([report], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lap-assessment-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    setIsGenerating(false)
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('App installed successfully')
    }
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Oklahoma LAP Assessment
          </h1>
          <p className="text-gray-600">
            Pottawatomie County Law Enforcement
          </p>
        </div>

        {showInstallPrompt && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Install this app for quick access and offline use
                </p>
                <button
                  onClick={handleInstall}
                  className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Install Now →
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="border-b border-gray-200 pb-4">
                <p className="text-lg font-medium text-gray-900 mb-3">
                  {question.id}. {question.text}
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleAnswer(question.id, true)}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      question.answer === true
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Yes
                  </button>
                  <button
                    onClick={() => handleAnswer(question.id, false)}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      question.answer === false
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="-ml-1 mr-3 h-5 w-5" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OklahomaLAPApp 