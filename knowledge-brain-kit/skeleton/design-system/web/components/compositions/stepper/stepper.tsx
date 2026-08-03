import React, { useState, Children, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '~/lib/utils';
import { Button } from '~/components/primitives/button';

export interface StepProps {
    children?: React.ReactNode;
    title?: string;
}

export function Step({ children }: StepProps) {
    return <>{children}</>;
}

export interface StepperProps {
    children: React.ReactNode;
    initialStep?: number;
    onStepChange?: (step: number) => void;
    onFinalStepCompleted?: () => void;
    stepCircleContainerClassName?: string;
    stepContainerClassName?: string;
    contentClassName?: string;
    footerClassName?: string;
    backButtonText?: string;
    nextButtonText?: string;
    className?: string;
    disableStepIndicators?: boolean;
}

export default function Stepper({
    children,
    initialStep = 1,
    onStepChange = () => { },
    onFinalStepCompleted = () => { },
    stepCircleContainerClassName = '',
    stepContainerClassName = '',
    contentClassName = '',
    footerClassName = '',
    backButtonText = 'Back',
    nextButtonText = 'Continue',
    className = '',
    disableStepIndicators = false
}: StepperProps) {
    const [currentStep, setCurrentStep] = useState<number>(initialStep);
    const [direction, setDirection] = useState<number>(0);
    const stepsArray = Children.toArray(children).filter((child) => React.isValidElement(child));
    const totalSteps = stepsArray.length;
    const isCompleted = currentStep > totalSteps;
    const isLastStep = currentStep === totalSteps;

    const updateStep = (newStep: number) => {
        setCurrentStep(newStep);
        if (newStep > totalSteps) {
            onFinalStepCompleted();
        } else {
            onStepChange(newStep);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setDirection(-1);
            updateStep(currentStep - 1);
        }
    };

    const handleNext = () => {
        if (!isLastStep) {
            setDirection(1);
            updateStep(currentStep + 1);
        }
    };

    const handleComplete = () => {
        setDirection(1);
        updateStep(totalSteps + 1);
    };

    return (
        <>
            <style>{`
        .stepper-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: 24px;
        }

        .stepper-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 40px; /* Increased to prevent overlap with absolute step titles */
        }

        .step-container {
          display: flex;
          align-items: center;
          position: relative;
        }

        .step-indicator {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 600;
          font-size: 16px;
          color: var(--muted-foreground);
          background-color: var(--muted);
          border: 2px solid var(--border);
          transition: all 0.3s ease;
        }

        .step-indicator.active {
          color: var(--primary-foreground);
          background-color: var(--primary);
          border-color: var(--primary);
        }

        .step-indicator.completed {
          color: var(--primary-foreground);
          background-color: var(--primary);
          border-color: var(--primary);
        }

        .step-title {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--foreground);
          white-space: nowrap;
        }

        .step-connector {
          flex: 1;
          height: 2px;
          background-color: var(--border);
          margin: 0 12px;
          transition: background-color 0.3s ease;
        }

        .step-connector.active {
          background-color: var(--primary);
        }

        .stepper-content-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .stepper-content {
          width: 100%;
        }

        .stepper-footer {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-top: 24px;
        }

        .success-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }
      `}</style>
            <div className={cn("stepper-container", className)}>
                <div className={cn("stepper-header", stepContainerClassName)}>
                    {stepsArray.map((child, index) => {
                        const stepNumber = index + 1;
                        const isExisting = stepNumber <= currentStep;
                        const isActive = stepNumber === currentStep;
                        const isCompletedStep = stepNumber < currentStep;

                        const element = child as React.ReactElement<any>;
                        const title = element.props.title || `Step ${stepNumber}`;

                        return (
                            <React.Fragment key={stepNumber}>
                                <div className={cn("step-container", stepCircleContainerClassName)}>
                                    <div
                                        className={cn(
                                            "step-indicator",
                                            isActive ? 'active' : '',
                                            isCompletedStep ? 'completed' : '',
                                            disableStepIndicators ? 'cursor-default' : 'cursor-pointer hover:opacity-80'
                                        )}
                                        onClick={() => {
                                            if (!disableStepIndicators && stepNumber !== currentStep) {
                                                setDirection(stepNumber > currentStep ? 1 : -1);
                                                updateStep(stepNumber);
                                            }
                                        }}
                                    >
                                        {isCompletedStep ? (
                                            <svg
                                                className="w-5 h-5 text-current"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            stepNumber
                                        )}
                                    </div>
                                    <div className="step-title">{title}</div>
                                </div>

                                {stepNumber < totalSteps && (
                                    <div className={cn("step-connector", isExisting ? 'active' : '')} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                <div className={cn("stepper-content-wrapper", contentClassName)}>
                    <AnimatePresence mode="wait" custom={direction}>
                        {isCompleted ? (
                            <motion.div
                                key="completed"
                                custom={direction}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="success-message"
                            >
                                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">All steps completed!</h3>
                                <p className="text-muted-foreground">You have successfully finished the process.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={currentStep}
                                custom={direction}
                                initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="stepper-content"
                            >
                                {stepsArray[currentStep - 1]}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {!isCompleted && (
                    <div className={cn("stepper-footer", footerClassName)}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                        >
                            {backButtonText}
                        </Button>
                        <Button
                            size="sm"
                            onClick={isLastStep ? handleComplete : handleNext}
                        >
                            {isLastStep ? 'Complete' : nextButtonText}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
