import { useState, useEffect } from 'react'
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText,
  Loader2,
  Sun,
  Moon,
  MinusCircle,
  User,
  Shield,
  AlertTriangle
} from 'lucide-react'
import { ThemeProvider, useTheme } from './components/ThemeProvider'
import './theme.css'

type Answer = boolean | null | 'refused'

interface Question {
  id: number
  text: string
  answer: Answer
  isHighRisk?: boolean
}

interface PersonInfo {
  name: string
  dateOfBirth: string
  address: string
  phone: string
  relationship: string
  agency: string
}

interface OfficerInfo {
  fullName: string
  badgeNumber: string
  caseNumber: string
}

interface ProtocolInfo {
  additionalConcerns: string
  screeningResult: 'protocol' | 'officer' | 'none'
  contactedProgram: boolean
  contactReason: string
  spokeWithAdvocate: boolean
}

const AGENCIES = [
  "Absentee Shawnee Tribal Police",
  "Asher Police Department",
  "Citizen Potawatomi Nation Tribal Police",
  "Maud Police Department",
  "McLoud Police Department",
  "Oklahoma Highway Patrol – Troop A",
  "Pottawatomie County Sheriff's Office",
  "Sac and Fox Nation Police",
  "Shawnee Police Department",
  "Tecumseh Police Department"
]

function OklahomaLAPApp() {
  const { theme, toggleTheme } = useTheme()
  const [officerInfo, setOfficerInfo] = useState<OfficerInfo>({
    fullName: '',
    badgeNumber: '',
    caseNumber: ''
  })
  const [victimInfo, setVictimInfo] = useState<PersonInfo>({
    name: '',
    dateOfBirth: '',
    address: '',
    phone: '',
    relationship: '',
    agency: ''
  })
  const [suspectInfo, setSuspectInfo] = useState<PersonInfo>({
    name: '',
    dateOfBirth: '',
    address: '',
    phone: '',
    relationship: '',
    agency: ''
  })
  const [protocolInfo, setProtocolInfo] = useState<ProtocolInfo>({
    additionalConcerns: '',
    screeningResult: 'none',
    contactedProgram: false,
    contactReason: '',
    spokeWithAdvocate: false
  })
  const [showInfoForm, setShowInfoForm] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: "Has the person ever threatened to use or used a weapon against the victim?", answer: null, isHighRisk: true },
    { id: 2, text: "Has the person ever threatened to kill the victim or the children of the victim?", answer: null, isHighRisk: true },
    { id: 3, text: "Has the person ever tried to choke the victim?", answer: null, isHighRisk: true },
    { id: 4, text: "Has the person ever tried or threatened to kill him/herself?", answer: null, isHighRisk: true },
    { id: 5, text: "Does the victim think the person will try to kill the victim?", answer: null, isHighRisk: true },
    { id: 6, text: "Does the person have a gun or can he/she get one easily?", answer: null },
    { id: 7, text: "Is the person violently or constantly jealous or does the person attempt to control most of the daily activities of the victim?", answer: null },
    { id: 8, text: "Does the person follow or spy on the victim or leave the victim threatening or unwanted messages, phone calls or text messages?", answer: null },
    { id: 9, text: "Does the victim have any children the person knows is not his/her own child?", answer: null },
    { id: 10, text: "Has the victim left or separated from the person after living together or being married?", answer: null },
    { id: 11, text: "Is the person unemployed?", answer: null }
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

  const handleAnswer = (id: number, answer: Answer) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, answer } : q
    ))
  }

  const getDangerLevel = () => {
    // Check high-risk questions (1-5)
    const hasHighRiskYes = questions
      .filter(q => q.isHighRisk)
      .some(q => q.answer === true)

    if (hasHighRiskYes) {
      return 'high'
    }

    // If no high-risk yes answers, check for 3 or more yes answers in questions 6-11
    const nonHighRiskYesCount = questions
      .filter(q => !q.isHighRisk)
      .filter(q => q.answer === true)
      .length

    if (nonHighRiskYesCount >= 3) {
      return 'high'
    }

    return 'low'
  }

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowInfoForm(false)
  }

  const generateReport = async () => {
    setIsGenerating(true)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const dangerLevel = getDangerLevel()
    const report = `Oklahoma LAP Assessment Report\n\n` +
      `Date: ${new Date().toLocaleDateString()}\n` +
      `Time: ${new Date().toLocaleTimeString()}\n` +
      `Agency: ${victimInfo.agency}\n` +
      `Case Number: ${officerInfo.caseNumber}\n` +
      `Officer: ${officerInfo.fullName}\n` +
      `Badge Number: ${officerInfo.badgeNumber}\n\n` +
      `Victim Information:\n` +
      `Name: ${victimInfo.name}\n` +
      `Date of Birth: ${victimInfo.dateOfBirth}\n` +
      `Address: ${victimInfo.address}\n` +
      `Phone: ${victimInfo.phone}\n` +
      `Relationship to Suspect: ${victimInfo.relationship}\n\n` +
      `Suspect Information:\n` +
      `Name: ${suspectInfo.name}\n` +
      `Date of Birth: ${suspectInfo.dateOfBirth}\n` +
      `Address: ${suspectInfo.address}\n` +
      `Phone: ${suspectInfo.phone}\n` +
      `Relationship to Victim: ${suspectInfo.relationship}\n\n` +
      `Risk Level: ${dangerLevel.toUpperCase()}\n\n` +
      `Questions Answered:\n` +
      questions.map(q => 
        `${q.id}. ${q.text}\nAnswer: ${q.answer === null ? 'Not Answered' : q.answer === 'refused' ? 'Refused' : q.answer ? 'Yes' : 'No'}`
      ).join('\n\n') + 
      '\n\nAdditional Safety Concerns:\n' +
      `${protocolInfo.additionalConcerns}\n\n` +
      `Screening Result:\n` +
      `${protocolInfo.screeningResult === 'protocol' ? 'Victim screened in according to the protocol' : 
        protocolInfo.screeningResult === 'officer' ? 'Victim screened in based on the belief of the officer' : 
        'Victim did not screen in'}\n\n` +
      (protocolInfo.screeningResult !== 'none' ? 
        `Program Contact:\n` +
        `Contacted local OAG Certified DV/SA Program or Tribal DV/SA Program: ${protocolInfo.contactedProgram ? 'Yes' : 'No'}\n` +
        (!protocolInfo.contactedProgram ? `Reason for no contact: ${protocolInfo.contactReason}\n` : '') +
        `Victim spoke with hotline advocate: ${protocolInfo.spokeWithAdvocate ? 'Yes' : 'No'}\n\n` : '') +
      `Assessment Result:\n` +
      (dangerLevel === 'high' ? 
        'Protocol referral is triggered based on responses.' : 
        'Protocol referral is not triggered based on responses.')

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="h-6 w-6 text-gray-600" />
              ) : (
                <Sun className="h-6 w-6 text-yellow-400" />
              )}
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            Oklahoma LAP Assessment
          </h1>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Pottawatomie County Law Enforcement
          </p>
        </div>

        {showInstallPrompt && (
          <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 p-4 mb-6 transition-colors duration-300">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-200 transition-colors duration-300">
                  Install this app for quick access and offline use
                </p>
                <button
                  onClick={handleInstall}
                  className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-300 hover:text-blue-500 dark:hover:text-blue-200 transition-colors duration-200"
                >
                  Install Now →
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-300">
          {showInfoForm ? (
            <form onSubmit={handleInfoSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Shield className="h-6 w-6 mr-2" />
                    Officer Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="officer-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Officer's Full Name
                      </label>
                      <input
                        type="text"
                        id="officer-name"
                        value={officerInfo.fullName}
                        onChange={(e) => setOfficerInfo({...officerInfo, fullName: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="badge-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Badge Number
                      </label>
                      <input
                        type="text"
                        id="badge-number"
                        value={officerInfo.badgeNumber}
                        onChange={(e) => setOfficerInfo({...officerInfo, badgeNumber: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="case-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Agency Case Number
                      </label>
                      <input
                        type="text"
                        id="case-number"
                        value={officerInfo.caseNumber}
                        onChange={(e) => setOfficerInfo({...officerInfo, caseNumber: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <User className="h-6 w-6 mr-2" />
                    Victim Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="victim-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="victim-name"
                        value={victimInfo.name}
                        onChange={(e) => setVictimInfo({...victimInfo, name: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="victim-dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="victim-dob"
                        value={victimInfo.dateOfBirth}
                        onChange={(e) => setVictimInfo({...victimInfo, dateOfBirth: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="victim-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Address
                      </label>
                      <input
                        type="text"
                        id="victim-address"
                        value={victimInfo.address}
                        onChange={(e) => setVictimInfo({...victimInfo, address: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="victim-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="victim-phone"
                        value={victimInfo.phone}
                        onChange={(e) => setVictimInfo({...victimInfo, phone: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="victim-relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Relationship to Suspect
                      </label>
                      <input
                        type="text"
                        id="victim-relationship"
                        value={victimInfo.relationship}
                        onChange={(e) => setVictimInfo({...victimInfo, relationship: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="agency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Agency Name
                      </label>
                      <select
                        id="agency"
                        value={victimInfo.agency}
                        onChange={(e) => setVictimInfo({...victimInfo, agency: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      >
                        <option value="">Select an agency</option>
                        {AGENCIES.map((agency) => (
                          <option key={agency} value={agency}>
                            {agency}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Shield className="h-6 w-6 mr-2" />
                    Suspect Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="suspect-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="suspect-name"
                        value={suspectInfo.name}
                        onChange={(e) => setSuspectInfo({...suspectInfo, name: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="suspect-dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="suspect-dob"
                        value={suspectInfo.dateOfBirth}
                        onChange={(e) => setSuspectInfo({...suspectInfo, dateOfBirth: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="suspect-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Address
                      </label>
                      <input
                        type="text"
                        id="suspect-address"
                        value={suspectInfo.address}
                        onChange={(e) => setSuspectInfo({...suspectInfo, address: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="suspect-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="suspect-phone"
                        value={suspectInfo.phone}
                        onChange={(e) => setSuspectInfo({...suspectInfo, phone: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="suspect-relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Relationship to Victim
                      </label>
                      <input
                        type="text"
                        id="suspect-relationship"
                        value={suspectInfo.relationship}
                        onChange={(e) => setSuspectInfo({...suspectInfo, relationship: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue to Assessment
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-6">
                {questions.map((question) => (
                  <div key={question.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 transition-colors duration-300">
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                      {question.id}. {question.text}
                    </p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleAnswer(question.id, true)}
                        className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                          question.answer === true
                            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Yes
                      </button>
                      <button
                        onClick={() => handleAnswer(question.id, false)}
                        className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                          question.answer === false
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        No
                      </button>
                      <button
                        onClick={() => handleAnswer(question.id, 'refused')}
                        className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                          question.answer === 'refused'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <MinusCircle className="h-5 w-5 mr-2" />
                        Refused
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                    Additional Safety Assessment
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="additional-concerns" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Is there anything else that worries the victim about his or her safety? If so, what worries the victim?
                      </label>
                      <textarea
                        id="additional-concerns"
                        value={protocolInfo.additionalConcerns}
                        onChange={(e) => setProtocolInfo({...protocolInfo, additionalConcerns: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Screening Result:
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="screening-result"
                            checked={protocolInfo.screeningResult === 'protocol'}
                            onChange={() => setProtocolInfo({...protocolInfo, screeningResult: 'protocol'})}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">Victim screened in according to the protocol</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="screening-result"
                            checked={protocolInfo.screeningResult === 'officer'}
                            onChange={() => setProtocolInfo({...protocolInfo, screeningResult: 'officer'})}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">Victim screened in based on the belief of the officer</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="screening-result"
                            checked={protocolInfo.screeningResult === 'none'}
                            onChange={() => setProtocolInfo({...protocolInfo, screeningResult: 'none'})}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">Victim did not screen in</span>
                        </label>
                      </div>
                    </div>

                    {protocolInfo.screeningResult !== 'none' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Did the officer contact the local OAG Certified DV/SA Program or Tribal DV/SA Program?
                          </label>
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="contacted-program"
                                checked={protocolInfo.contactedProgram}
                                onChange={() => setProtocolInfo({...protocolInfo, contactedProgram: true})}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700 dark:text-gray-300">Yes</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="contacted-program"
                                checked={!protocolInfo.contactedProgram}
                                onChange={() => setProtocolInfo({...protocolInfo, contactedProgram: false})}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700 dark:text-gray-300">No</span>
                            </label>
                          </div>
                        </div>

                        {!protocolInfo.contactedProgram && (
                          <div>
                            <label htmlFor="contact-reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              If "no" state why:
                            </label>
                            <textarea
                              id="contact-reason"
                              value={protocolInfo.contactReason}
                              onChange={(e) => setProtocolInfo({...protocolInfo, contactReason: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              rows={2}
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            After advising the victim of high risk for danger/lethality, did the victim speak with the hotline advocate?
                          </label>
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="spoke-with-advocate"
                                checked={protocolInfo.spokeWithAdvocate}
                                onChange={() => setProtocolInfo({...protocolInfo, spokeWithAdvocate: true})}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700 dark:text-gray-300">Yes</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="spoke-with-advocate"
                                checked={!protocolInfo.spokeWithAdvocate}
                                onChange={() => setProtocolInfo({...protocolInfo, spokeWithAdvocate: false})}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-gray-700 dark:text-gray-300">No</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Note: The questions above and the criteria for determining the level of risk a person faces is based on the best available research on factors
                    associated with lethal violence by a current or former intimate partner. However, each situation may present unique factors that influence risk for
                    lethal violence that are not captured by this screen. Although most victims who screen "positive" or "high danger" would not be expected to be
                    killed, these victims face much higher risk than of other victims of intimate partner violence.
                  </p>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={generateReport}
                    disabled={isGenerating}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Wrap the app with ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <OklahomaLAPApp />
    </ThemeProvider>
  )
} 