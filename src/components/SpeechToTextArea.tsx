"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faStop,
  faSpinner,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Mic, Square, Loader2 } from 'lucide-react';

const CHAT_INPUT_HEIGHT = "40px";

interface SpeechToTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  minHeight?: string;
  shouldSubmitOnEnter?: boolean;
}

export const SpeechToTextArea = forwardRef<any, SpeechToTextAreaProps>(
  (
    {
      value,
      onChange,
      onSubmit = () => {},
      placeholder = "Speak or type here...",
      isLoading = false,
      minHeight = "40px",
      shouldSubmitOnEnter = true,
    },
    ref
  ) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState(value);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
    }));

    const adjustTextareaHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = minHeight;
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    useEffect(() => {
      adjustTextareaHeight();
    }, [value]);

    const handleTextareaChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setTranscript(e.target.value);
      onChange(e);
      adjustTextareaHeight();
    };

    const handleSubmit = () => {
      if (transcript && !isLoading) {
        onSubmit(transcript);
      }
    };

    // Simulated recognition - in a real application, you would use the Web Speech API
    const simulateRecognition = () => {
      setIsRecording(true);
      
      // Create a timer that adds text progressively to simulate speech recognition
      let elapsedTime = 0;
      const phrases = [
        "Add ingredient 20ml Base Color",
        "Mix with 30ml developer",
        "Apply evenly starting from roots"
      ];
      
      const interval = setInterval(() => {
        elapsedTime += 1;
        
        if (elapsedTime <= phrases.length) {
          const simulatedText = phrases.slice(0, elapsedTime).join(". ");
          setTranscript(simulatedText);
          
          // Create a synthetic change event
          if (textareaRef.current) {
            const event = {
              target: {
                value: simulatedText
              }
            } as React.ChangeEvent<HTMLTextAreaElement>;
            onChange(event);
          }
        } else {
          clearInterval(interval);
          setIsRecording(false);
        }
      }, 1500);
      
      // Clean up
      return () => clearInterval(interval);
    };

    // Start recording
    const handleStartRecording = () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // Use the actual Web Speech API if available
        // This is just a placeholder - actual implementation would use the Web Speech API
        simulateRecognition();
      } else {
        // Fallback to simulation for browsers without Speech API
        simulateRecognition();
      }
    };

    // Stop recording
    const handleStopRecording = () => {
      setIsRecording(false);
      
      // Submit the transcript when recording stops
      if (transcript) {
        onSubmit(transcript);
      }
    };

    // Handle textarea keydown event
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && shouldSubmitOnEnter) {
        e.preventDefault();
        handleSubmit();
      }
    };

    return (
      <div className="relative flex items-center rounded-md border border-gray-300 bg-background px-1 py-1 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            minHeight: minHeight,
          }}
        >
          <textarea
            ref={textareaRef}
            style={{
              height: minHeight,
            }}
            className={`${
              isLoading ? "opacity-50" : ""
            } hide-scrollbar transition-height m-0 flex-1 resize-none border-0 bg-transparent px-3 py-2 transition-colors focus:outline-none focus:ring-0 focus-visible:ring-0`}
            value={transcript}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "" : placeholder}
            rows={1}
            disabled={isLoading || isRecording}
          />
          <div className="flex items-center gap-1 px-2">
            <button
              type="button"
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isRecording
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
              disabled={isTranscribing || isLoading}
            >
              {isTranscribing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                isRecording ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Mic className="h-5 w-5" />
                )
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

SpeechToTextArea.displayName = "SpeechToTextArea";

export default SpeechToTextArea;
