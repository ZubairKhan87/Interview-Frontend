import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.png';
import "../../styles/Interview.css";
const BASE_API_URL = import.meta.env.VITE_API_URL;

// Placeholder logo component
const CompanyLogo = () => (
    <div
        style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#3498db',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10%',
            overflow: 'hidden',
            marginLeft: '10px'
        }}
    >
        <img
            src={logo}
            alt="TalentScout Logo"
            style={{
                maxWidth: '100%',
                maxHeight: '100%',
            }}
        />
    </div>
);

// Timer Component
const InterviewTimer = ({ duration = 300 }) => {
    const [timeRemaining, setTimeRemaining] = useState(duration);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        let interval;
        if (isRunning && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeRemaining]);

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: timeRemaining < 60 ? '#ff6b6b' : '#4ecdc4',
            borderRadius: '10px',
            color: 'white'
        }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
            </div>
            <div>Time Remaining</div>
        </div>
    );
};

// Create a separate axios instance for frame uploads
const frameApi = axios.create({
    baseURL: `${BASE_API_URL}`,
    withCredentials: true
});

// Add interceptor for authentication
frameApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const WebcamFeed = () => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const canvasRef = useRef(document.createElement('canvas'));
    const location = useLocation();
    const { jobId, candidateId } = location.state || {};
    const frameIntervalRef = useRef(null);

    // Function to get CSRF token and set up cookie
    const setupCSRF = async () => {
        try {
            await frameApi.get('/api/chat/get-csrf-token/', {
                withCredentials: true
            });
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    };

    const captureFrame = async () => {
        if (!videoRef.current || !streamRef.current) {
            return;
        }
    
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
            return;
        }
    
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        try {
            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Canvas to Blob conversion failed'));
                }, 'image/jpeg', 0.8);
            });
    
            // Create a safe timestamp format
            const now = new Date();
            const timestamp = now.toISOString();
            const safeTimestamp = now.getTime(); // Use milliseconds timestamp instead
            
            const formData = new FormData();
            formData.append('frame', blob, `frame_${safeTimestamp}.jpg`);
            formData.append('job_id', jobId);
            formData.append('candidate_id', candidateId);
            formData.append('timestamp', timestamp);
    
            // Get CSRF token from cookie
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))
                ?.split('=')[1];
    
            if (!csrfToken) {
                await setupCSRF();
            }
    
            await frameApi.post('/api/chat/save-frame/', formData, {
                headers: {
                    'X-CSRFToken': document.cookie
                        .split('; ')
                        .find(row => row.startsWith('csrftoken='))
                        ?.split('=')[1] || '',
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            console.error('Error capturing/sending frame:', error.message);
        }
    };

    useEffect(() => {
        let mounted = true;

        const startWebcam = async () => {
            try {
                // Set up CSRF token first
                await setupCSRF();

                if (!jobId || !candidateId) {
                    throw new Error('Job ID or Candidate ID missing');
                }

                if (streamRef.current) {
                    stopWebcam();
                }

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user'
                    }
                });
                
                if (!mounted) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        // Start frame capture at a reduced rate (every 5 seconds)
                        if (frameIntervalRef.current) {
                            clearInterval(frameIntervalRef.current);
                        }
                        frameIntervalRef.current = setInterval(captureFrame, 5000);
                    };
                }
            } catch (err) {
                console.error("Error accessing webcam:", err.message);
                if (err.name === 'NotAllowedError') {
                    alert('Please allow camera access to continue with the interview.');
                } else if (err.name === 'NotReadableError') {
                    alert('Could not access your camera. Please make sure no other application is using it.');
                }
            }
        };

        const stopWebcam = () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            if (frameIntervalRef.current) {
                clearInterval(frameIntervalRef.current);
                frameIntervalRef.current = null;
            }
        };

        startWebcam();

        return () => {
            mounted = false;
            stopWebcam();
        };
    }, [jobId, candidateId]);

    return (
        <div style={{height: '400px'}} className="relative w-full bg-gray-200 rounded-lg overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{height: '400px'}}
                className="w-full object-cover"
            />
            {(!jobId || !candidateId) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                    <p>Missing job or candidate information</p>
                </div>
            )}
        </div>
    );
};

// Instructions for Candidates
const Instructions = () => (
    <div style={{
        backgroundColor: '#f7f9fc',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px'
    }}>
        <h4>Instructions for the Candidate</h4>
        <ul>
            <li>Ensure your microphone and camera are working properly.</li>
            <li>Answer the questions clearly and concisely.</li>
            <li>Wait for the next question after completing your response.</li>
            <li>You cannot reset the interview once it has started.</li>
        </ul>
    </div>
);

const Chat = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { jobId, candidateId, jobTitle } = location.state || {};
    const [displayedQuestion, setDisplayedQuestion] = useState('');
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const typingSpeedRef = useRef(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [interviewEnded, setInterviewEnded] = useState(false);
    const [lastIntent, setLastIntent] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [isInterviewActive, setIsInterviewActive] = useState(true);
    const [recordingStatus, setRecordingStatus] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isInterviewStarted, setIsInterviewStarted] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    
    // Refs for audio handling
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(null);
    const audioContextRef = useRef(null);
    const speechTimeoutRef = useRef(null);
    
    // Use this to update application status on the backend
    const updateApplicationStatus = async (status) => {
        try {
            await axios.post(`${BASE_API_URL}/api/applications/update-status/`, {
                job_id: jobId,
                candidate_id: candidateId,
                status: status
            });
        } catch (error) {
            console.error('Error updating application status:', error);
        }
    };
    
    // Enhanced navigation prevention
    useEffect(() => {
        // Prevent back navigation
        const preventBackNavigation = (event) => {
            // Push a new state to prevent default back button behavior
            window.history.pushState(null, document.title, window.location.href);
            
            // Show a warning dialog
            event.preventDefault();
            event.returnValue = ''; // Required for Chrome
            
            // Custom alert about interview in progress
            alert('You cannot navigate away during the interview. The interview will be terminated if you attempt to leave.');
        };

        // Add event listeners for preventing navigation
        window.addEventListener('popstate', preventBackNavigation);
        
        // Prevent closing or reloading the tab
        const handleBeforeUnload = (event) => {
            if (isInterviewActive) {
                event.preventDefault(); // Cancel the event
                event.returnValue = 'Interview in progress. Are you sure you want to leave?';
                
                // Attempt to end interview
                try {
                    axios.post(`${BASE_API_URL}/api/chat/chat/`, {
                        job_id: jobId,
                        candidate_id: candidateId
                    });
                } catch (error) {
                    console.error('Error reporting interview termination:', error);
                }
                
                return 'Interview in progress. Are you sure you want to leave?';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Disable browser back and forward buttons
        window.history.pushState(null, document.title, window.location.href);

        return () => {
            window.removeEventListener('popstate', preventBackNavigation);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isInterviewActive, jobId, candidateId]);

    // Route protection
    useEffect(() => {
        // Check if user is allowed to be on this page
        const checkRouteAccess = () => {
            const allowedRoutes = ['/interview', '/thank-you'];
            const currentPath = window.location.pathname;

            if (!isInterviewActive && !allowedRoutes.includes(currentPath)) {
                // Redirect to applied jobs if trying to access interview without proper context
                navigate('/applied-jobs');
            }
        };

        checkRouteAccess();
    }, [isInterviewActive, navigate]);

    // Handle interview termination
    const handleInterviewTermination = useCallback(async (reason = 'Interview terminated') => {
        try {
            // Clean up audio resources
            cleanupAudioResources();
            
            await axios.post(`${BASE_API_URL}/api/chat/chat/`, {
                job_id: jobId,
                candidate_id: candidateId
            });

            // Update application status
            await updateApplicationStatus('completed');

            // Disable further navigation
            setIsInterviewActive(false);
            setInterviewEnded(true);

            // Redirect to a specific page after a delay to allow final message to be heard
            setTimeout(() => {
                navigate('/thank-you', { 
                    state: { 
                        message: 'Interview completed successfully.',
                        preventBack: true 
                    } 
                });
            }, 4000);
        } catch (error) {
            console.error('Error handling interview termination:', error);
            navigate('/applied-jobs');
        }
    }, [jobId, candidateId, navigate]);

    // Cleanup function for audio resources
    const cleanupAudioResources = useCallback(() => {
        // Cancel any text animation
        if (typingSpeedRef.current) {
            clearInterval(typingSpeedRef.current);
            typingSpeedRef.current = null;
        }
        
        // Stop any speech synthesis
        if (audioRef.current) {
            audioRef.current.pause();
            if (audioRef.current.src) {
                URL.revokeObjectURL(audioRef.current.src);
            }
            audioRef.current = null;
        }
        
        // Clear any timeouts
        if (speechTimeoutRef.current) {
            clearTimeout(speechTimeoutRef.current);
            speechTimeoutRef.current = null;
        }
        
        // Stop any recording
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }
        
        // Reset audio chunks
        audioChunksRef.current = [];
        
        // Close audio context if open
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(err => console.error('Error closing audio context:', err));
            audioContextRef.current = null;
        }
    }, []);
    
    // Animate text with improved handling
    const animateText = useCallback((text) => {
        // Clean up any existing animation
        if (typingSpeedRef.current) {
            clearInterval(typingSpeedRef.current);
            typingSpeedRef.current = null;
        }
        
        if (!text) {
            setDisplayedQuestion('');
            return;
        }
        
        // Create a clean copy of the text
        const textToAnimate = String(text).trim();
        let index = 0;
        setDisplayedQuestion('');
        
        // Create new typing animation
        typingSpeedRef.current = setInterval(() => {
            if (index < textToAnimate.length) {
                setDisplayedQuestion(textToAnimate.substring(0, index + 1));
                index++;
            } else {
                clearInterval(typingSpeedRef.current);
                typingSpeedRef.current = null;
            }
        }, 30); // Slightly faster typing for better UX
    }, []);

    // Speak message using Groq TTS API
    const speakMessage = useCallback((message) => {
        // Clean up any existing audio
        cleanupAudioResources();
        
        if (!message) return;
        
        const textToSpeak = String(message).trim();
        
        // Start the typing animation
        animateText(textToSpeak);
        
        // Set speaking state
        setIsSpeaking(true);
        console.log("spech",import.meta.env.VITE_GROQ_API_KEY)
        // Call Groq API to generate speech
        fetch("https://api.groq.com/openai/v1/audio/speech", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
                //API_gsk_jFRQkWV7ykR6yzScRxPAWGdyb3FYrQAFHLP2W0ubi2syHxASye7Y
                //API_gsk_aaViIpcvjGrz3rGpgvGXWGdyb3FYrQikdgA07LsdHKb3fdjFRuIS
                
            },
            body: JSON.stringify({
                model: "playai-tts",
                voice: "Arista-PlayAI",
                input: textToSpeak,
                response_format: "wav"
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            return response.arrayBuffer();
        })
        .then(audioArrayBuffer => {
            // Create audio blob and play it
            const audioBlob = new Blob([audioArrayBuffer], { type: "audio/wav" });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            // Store reference to audio
            audioRef.current = audio;
            
            // Set up the onended event handler
            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(audioUrl);
                
                // Add a short delay before starting recording to prevent audio overlap
                speechTimeoutRef.current = setTimeout(() => {
                    startRecording();
                }, 800);
            };
            
            // Play the audio
            audio.play().catch(err => {
                console.error("Error playing audio:", err);
                setIsSpeaking(false);
                startRecording(); // Fallback to recording if audio fails
            });
        })
        .catch(err => {
            console.error("Error generating speech:", err);
            setIsSpeaking(false);
            // Even if TTS fails, we start recording after a short delay
            speechTimeoutRef.current = setTimeout(() => {
                startRecording();
            }, 1000);
        });
    }, [animateText, cleanupAudioResources]);

    // Start recording function with improved error handling
    const startRecording = useCallback(() => {
        // Clean up any existing recording
        audioChunksRef.current = [];
        
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        
        // Request microphone access with proper error handling
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                // Stop any existing tracks
                if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
                    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
                }
                
                // Create a new media recorder with the stream
                mediaRecorderRef.current = new MediaRecorder(stream);
                
                // Set up data handling
                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data && event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };
                
                // Handle recorder errors
                mediaRecorderRef.current.onerror = (event) => {
                    console.error('Media Recorder error:', event.error);
                    setRecordingStatus('Recording error occurred');
                    setIsRecording(false);
                };

                // Start recording with short time slices for better responsiveness
                mediaRecorderRef.current.start(200);
                setIsRecording(true);
                setRecordingStatus('Recording... Speak now');
                
                // Create audio meter to visualize audio levels (optional enhancement)
                try {
                    if (!audioContextRef.current) {
                        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                    }
                    
                    // Additional audio processing could be added here
                } catch (err) {
                    console.error('Audio context error:', err);
                }
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
                setRecordingStatus('Error: Could not access microphone');
                
                // If this is the first question, we need to handle the error more gracefully
                if (questionCount === 0) {
                    alert('Microphone access is required for the interview. Please allow access and try again.');
                }
            });
    }, [questionCount]);

    // Stop recording and send for transcription
    const stopRecordingAndSend = useCallback(async () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
            console.warn('No active recording to stop');
            return;
        }
        
        setIsRecording(false);
        setRecordingStatus('Processing your answer...');
        
        // Create a promise to handle the recorder stop event
        const recordingStoppedPromise = new Promise((resolve) => {
            mediaRecorderRef.current.onstop = () => resolve();
        });
        
        // Stop the recording
        mediaRecorderRef.current.stop();
        
        // Wait for the recorder to finish
        await recordingStoppedPromise;
        
        try {
            // Create a blob from the audio chunks
            if (!audioChunksRef.current.length) {
                throw new Error('No audio data recorded');
            }
            
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            
            // Create form data to send the audio file
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            
            // Send the audio to the backend for transcription
            const transcriptionResponse = await frameApi.post('/api/chat/transcribe/', 
                formData, 
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            
            // Get the transcribed text
            const transcribedText = transcriptionResponse.data.transcription;
            setCurrentAnswer(transcribedText || "No speech detected");
            
            if (!transcribedText) {
                setRecordingStatus('No speech detected. Please try again.');
                return;
            }
            
            // Send the transcribed text for processing
            const chatResponse = await axios.post(`${BASE_API_URL}/api/chat/chat/`, {
                message: transcribedText,
                job_id: jobId,
                candidate_id: candidateId,
                candidateName: candidateName
            });
            
            // Process the response
            setLastIntent(chatResponse.data.intent || '');
            setQuestionCount(chatResponse.data.question_count || 0);
            
            // Check if interview has ended
            if (chatResponse.data.intent === 'Quit_interview' || chatResponse.data.interview_ended) {
                // Speak the final message before ending
                speakMessage(chatResponse.data.response);
                
                // End the interview after the message is spoken
                await handleInterviewTermination('Interview completed');
                return;
            }
            
            // Continue with next question
            const nextQuestion = chatResponse.data.response;
            setCurrentAnswer('');
            
            // Slight delay before speaking next question for better flow
            setTimeout(() => {
                speakMessage(nextQuestion);
            }, 500);
            
        } catch (error) {
            console.error('Error processing audio:', error);
            setRecordingStatus('Error processing your answer. Please try again.');
            
            // After a delay, restart recording so the interview can continue
            setTimeout(() => {
                startRecording();
            }, 2000);
        }
    }, [jobId, candidateId, candidateName, speakMessage, handleInterviewTermination, startRecording]);

    // Initialize the interview
    const initializeInterview = useCallback(async () => {
        setIsInitializing(true);
        
        try {
            // Check if we have the required parameters
            if (!jobId || !candidateId) {
                console.error('Missing required parameters');
                navigate('/applied-jobs');
                return;
            }
            
            // Request microphone permission early
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                // Stop the stream right away, we just wanted to get permission
                stream.getTracks().forEach(track => track.stop());
            } catch (err) {
                console.error('Failed to get microphone permission:', err);
                alert('Microphone access is required for the interview. Please allow access and reload the page.');
            }
            
            // Start the interview by requesting the first question
            const response = await axios.post(`${BASE_API_URL}/api/chat/chat/`, {
                reset: true,
                job_id: jobId,
                candidate_id: candidateId
            });
            
            if (response.data?.reset && response.data?.response) {
                const questionText = response.data.response.trim();
                
                // Set candidate name if available
                if (response.data.candidateName) {
                    setCandidateName(response.data.candidateName);
                }
                
                // Reset interview state
                setQuestionCount(0);
                setInterviewEnded(false);
                setLastIntent('');
                setIsInterviewActive(true);
                
                // Slight delay before starting the first question
                setTimeout(() => {
                    speakMessage(questionText);
                    setIsInterviewStarted(true);
                }, 1000);
            } else {
                throw new Error('Failed to initialize interview');
            }
        } catch (error) {
            console.error('Error initializing interview:', error);
            setIsInterviewActive(false);
            alert('Failed to start the interview. Please try again later.');
            navigate('/applied-jobs');
        } finally {
            setIsInitializing(false);
        }
    }, [jobId, candidateId, navigate, speakMessage]);

    // Initialize interview on component mount
    useEffect(() => {
        initializeInterview();
        
        return () => {
            // Clean up all resources when component unmounts
            cleanupAudioResources();
        };
    }, [initializeInterview, cleanupAudioResources]);

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh',
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <CompanyLogo />
                <div style={{ textAlign: 'center' }}>
                    <h2>Technical Intervieww</h2>
                    <div>Candidate: {candidateName || 'Loading...'} | Position: {jobTitle || 'Technical Role'}</div>
                </div>
                <div>{new Date().toLocaleString()}</div>
            </div>

            {/* Instructions */}
            <Instructions />

            {/* Main Interview Container */}
            <div style={{
                display: 'flex',
                gap: '20px',
                backgroundColor: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                padding: '20px'
            }}>
                {/* Webcam Feed */}
                <div style={{ flex: 2 }}>
                    <WebcamFeed />
                </div>

                {/* Chat Interface */}
                <div style={{ flex: 3 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <InterviewTimer duration={600} />
                        <div style={{ textAlign: 'right' }}>
                            <div>Questions: {questionCount}/9</div>
                        </div>
                    </div>

                    {/* Question and Answer Display */}
                    <div style={{
                        height: '200px',
                        overflowY: 'auto',
                        border: '1px solid #ddd',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <div style={{ marginBottom: '15px' }}>
                            <strong style={{ color: '#3498db' }}>Question:</strong> {displayedQuestion}
                            {isSpeaking && <span className="cursor" style={{ animation: 'blink 1s infinite' }}>|</span>}
                        </div>
                        <div>
                            <strong style={{ color: '#2ecc71' }}>Your Answer:</strong> {currentAnswer}
                        </div>
                    </div>

                    {/* Recording Status */}
                    {isRecording && (
                        <div style={{
                            textAlign: 'center',
                            margin: '10px 0',
                            padding: '8px',
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: 'red',
                                borderRadius: '50%',
                                marginRight: '10px',
                                animation: 'pulse 1s infinite'
                            }} />
                            {recordingStatus || 'Recording in progress...'}
                        </div>
                    )}

                    {/* Animations */}
                    <style>
                        {`
                        @keyframes pulse {
                            0% { opacity: 1; }
                            50% { opacity: 0.5; }
                            100% { opacity: 1; }
                        }
                        @keyframes blink {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0; }
                        }
                        `}
                    </style>

                    {/* Controls */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '20px'
                    }}>
                        {isInitializing ? (
                            <div style={{
                                width: '100%',
                                textAlign: 'center',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: '#f0f0f0'
                
                            }}>
                            <span>Initializing interview...</span>
                        </div>
                        ) : isRecording ? (
                            <button 
                                onClick={stopRecordingAndSend}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                Stop Recording
                            </button>
                        ) : isInterviewStarted ? (
                            <div style={{
                                width: '100%',
                                textAlign: 'center',
                                padding: '15px',
                                borderRadius: '8px',
                                backgroundColor: '#f0f0f0'
                            }}>
                                {isSpeaking ? 'Please wait while the interviewer is speaking...' : 'Processing...'}
                            </div>
                        ) : (
                            <button 
                                onClick={initializeInterview}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                Start Interview
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Hidden audio element for playback */}
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* Status Messages */}
            {interviewEnded && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#d4edda',
                    borderRadius: '5px',
                    textAlign: 'center'
                }}>
                    <h3>Interview Complete</h3>
                    <p>Thank you for participating. You will be redirected shortly.</p>
                </div>
            )}
        </div>
    );
};

export default Chat;