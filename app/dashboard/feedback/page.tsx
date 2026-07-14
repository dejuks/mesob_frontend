"use client";
import api from "@/lib/api";
import Image from "next/image";
import mesob from "../../mesob.jpg";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./feedback.css";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    useWindows,
    useWindowServices,
    useCreateFeedback,
} from "@/hooks/use-feedback";
import type { FeedbackPayload } from "@/types/feedback";
import Swal from "sweetalert2";
import {
    Loader2,
    Heart,
    ChevronRight,
    Building,
    Star,
    Users,
    CheckCircle2,
    ArrowLeft,
} from "lucide-react";

/* ==========================================================
| Validation Schema
========================================================== */

const feedbackSchema = z.object({
    window_id: z.number({
        required_error: "Please select a window.",
    }),
    service_id: z.number({
        required_error: "Please select a service.",
    }),
    overall_rating: z.number().min(1).max(5),
    staff_behavior: z.number().min(1).max(5),
    waiting_time: z.number().min(1).max(5),
    service_quality: z.number().min(1).max(5),
    cleanliness: z.number().min(1).max(5),
    satisfaction: z.enum(["highly_satisfied", "satisfied", "not_satisfied"]),
    comment: z.string().optional(),
    gender: z.enum(["male", "female"]).optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

/* ==========================================================
| Star Rating Field
========================================================== */

interface StarRatingProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

function StarRating({ label, value, onChange }: StarRatingProps) {
    return (
        <div className="rating-group">
            <div className="rating-label">
                <span>{label}</span>
                <span className="rating-value">{value} / 5</span>
            </div>
            <div className="star-row">
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        type="button"
                        key={n}
                        className={`star-btn ${n <= value ? "filled" : ""}`}
                        onClick={() => onChange(n)}
                    >
                        <Star
                            className="w-7 h-7"
                            fill={n <= value ? "currentColor" : "none"}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ==========================================================
| Service Selection Popup
========================================================== */

interface ServicePopupProps {
    isOpen: boolean;
    onClose: () => void;
    window: any;
    services: any[];
    onSelectService: (serviceId: number) => void;
    isLoading: boolean;
    windowName?: string;
}

function ServicePopup({
                          isOpen,
                          onClose,
                          window,
                          services,
                          onSelectService,
                          isLoading,
                          windowName,
                      }: ServicePopupProps) {
    const [selectedService, setSelectedService] = useState<number | null>(null);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [selectedServiceName, setSelectedServiceName] = useState("");

    const handleServiceClick = (serviceId: number, serviceName: string) => {
        setSelectedService(serviceId);
        setSelectedServiceName(serviceName);
        setShowFeedbackForm(true);
    };

    const handleBack = () => {
        setShowFeedbackForm(false);
        setSelectedService(null);
    };

    if (showFeedbackForm && selectedService) {
        return (
            <FeedbackFormModal
                isOpen={isOpen}
                onClose={onClose}
                windowId={window?.id}
                windowName={windowName}
                serviceId={selectedService}
                serviceName={selectedServiceName}
                onBack={handleBack}
            />
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="kiosk-dialog max-w-2xl">
                <div className="kiosk-dialog-inner">
                    <DialogHeader>
                        <DialogTitle className="kiosk-dialog-title">
                            <Building className="w-7 h-7" style={{ color: "var(--primary)" }} />
                            {windowName || window?.name || "Service Window"}
                        </DialogTitle>
                        <DialogDescription className="kiosk-dialog-desc">
                            Please select a service from the list below
                        </DialogDescription>
                        <span className="card-badge" style={{ display: "inline-block", marginTop: 14, width: "fit-content" }}>
                            {services.length} services
                        </span>
                    </DialogHeader>

                    <div style={{ marginTop: 26 }}>
                        {isLoading ? (
                            <div className="kiosk-loading">
                                <Loader2 className="w-8 h-8 kiosk-spin" />
                                <span>Loading services...</span>
                            </div>
                        ) : services.length === 0 ? (
                            <div className="kiosk-empty">
                                No services available for this window
                            </div>
                        ) : (
                            <div className="service-list">
                                {services.map((service: any, index: number) => (
                                    <div
                                        key={service.id || index}
                                        className="service-row"
                                        onClick={() =>
                                            handleServiceClick(
                                                service.id || index,
                                                service.name || `Service ${index + 1}`
                                            )
                                        }
                                    >
                                        <div className="service-row-left">
                                            <div className="service-index">{index + 1}</div>
                                            <div>
                                                <p className="service-name">
                                                    {service.name || `Service ${index + 1}`}
                                                </p>
                                                {service.description && (
                                                    <p className="service-desc">
                                                        {service.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5" style={{ color: "rgba(61,53,41,.4)" }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="kiosk-btn-row">
                        <button className="kiosk-btn kiosk-btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ==========================================================
| Feedback Form Modal
========================================================== */

interface FeedbackFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    windowId: number;
    windowName?: string;
    serviceId: number;
    serviceName: string;
    onBack: () => void;
}

function FeedbackFormModal({
                               isOpen,
                               onClose,
                               windowId,
                               windowName,
                               serviceId,
                               serviceName,
                               onBack,
                           }: FeedbackFormModalProps) {
    const createFeedback = useCreateFeedback();

    const form = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            window_id: windowId,
            service_id: serviceId,
            overall_rating: 5,
            staff_behavior: 5,
            waiting_time: 5,
            service_quality: 5,
            cleanliness: 5,
            satisfaction: "highly_satisfied",
            comment: "",
            gender: undefined,
        },
    });

    useEffect(() => {
        form.setValue("window_id", windowId);
        form.setValue("service_id", serviceId);
    }, [windowId, serviceId, form]);

    const onSubmit = async (values: FeedbackFormValues) => {
        try {
            const { window_id, ...payload } = values;
            await createFeedback.mutateAsync(payload as FeedbackPayload);
            Swal.fire({
                icon: "success",
                title: "Thank you!",
                text: "Your feedback has been submitted successfully 🎉",
                confirmButtonText: "Done",
                background: "rgba(250, 249, 245, 0.97)",
                color: "#3D3929",
                confirmButtonColor: "#C96442",
                backdrop: "rgba(61, 53, 41, 0.35)",
                customClass: {
                    popup: "kiosk-swal-popup",
                    confirmButton: "kiosk-swal-confirm",
                },
            });
            form.reset({
                window_id: undefined,
                service_id: undefined,
                overall_rating: 5,
                staff_behavior: 5,
                waiting_time: 5,
                service_quality: 5,
                cleanliness: 5,
                satisfaction: "highly_satisfied",
                comment: "",
                gender: undefined,
            });
            onClose();
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Failed to submit feedback";
            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: message,
                confirmButtonText: "Try Again",
                background: "rgba(250, 249, 245, 0.97)",
                color: "#3D3929",
                confirmButtonColor: "#c0392b",
                backdrop: "rgba(61, 53, 41, 0.35)",
                customClass: {
                    popup: "kiosk-swal-popup",
                    confirmButton: "kiosk-swal-confirm",
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="kiosk-dialog max-w-2xl">
                <div className="kiosk-dialog-inner">
                    <DialogHeader>
                        <button type="button" className="kiosk-back-btn" onClick={onBack}>
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <DialogTitle className="kiosk-dialog-title" style={{ marginTop: 18 }}>
                            <Star className="w-7 h-7" style={{ color: "#D4A24C" }} fill="currentColor" />
                            Customer Feedback Form
                        </DialogTitle>
                        <DialogDescription className="kiosk-dialog-desc">
                            <strong>{windowName}</strong> &mdash; <strong>{serviceName}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {/* Rating Section */}


                            <hr className="kiosk-divider" />

                            {/* Satisfaction as priority-style option cards */}
                            <div>
                                <label className="kiosk-field-label">Overall Satisfaction</label>
                                <FormField
                                    control={form.control}
                                    name="satisfaction"
                                    render={({ field }) => (
                                        <div className="priority-options">
                                            {[
                                                { value: "highly_satisfied", label: "Highly Satisfied", emoji: "😊" },
                                                { value: "satisfied", label: "Satisfied", emoji: "🙂" },
                                                { value: "not_satisfied", label: "Not Satisfied", emoji: "😞" },
                                            ].map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    className={`priority-option ${
                                                        field.value === opt.value ? "selected" : ""
                                                    }`}
                                                    onClick={() => field.onChange(opt.value)}
                                                >
                                                    <div
                                                        className="priority-icon"
                                                        style={{ background: "rgba(201,100,66,.85)" }}
                                                    >
                                                        {opt.emoji}
                                                    </div>
                                                    <div>
                                                        <div className="priority-label">{opt.label}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                            </div>

                            <hr className="kiosk-divider" />

                            {/* Gender */}
                            <div className="kiosk-form-grid">
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="kiosk-field-label">Gender</FormLabel>
                                            <Select
                                                value={field.value ?? ""}
                                                onValueChange={(value) => field.onChange(value || undefined)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="kiosk-select-trigger">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="kiosk-select-content">
                                                    <SelectItem value="male" className="kiosk-select-item">
                                                        👨 Male
                                                    </SelectItem>
                                                    <SelectItem value="female" className="kiosk-select-item">
                                                        👩 Female
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="kiosk-error" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div style={{ marginTop: 22 }}>
                                <FormField
                                    control={form.control}
                                    name="comment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="kiosk-field-label">
                                                Additional Comments
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={4}
                                                    placeholder="Share your experience in detail..."
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    className="kiosk-textarea"
                                                />
                                            </FormControl>
                                            <FormMessage className="kiosk-error" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="kiosk-btn-row">
                                <button
                                    type="button"
                                    className="kiosk-btn kiosk-btn-outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="kiosk-btn kiosk-btn-primary"
                                    type="submit"
                                    disabled={createFeedback.isPending}
                                >
                                    {createFeedback.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 kiosk-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Heart className="w-4 h-4" />
                                            Submit Feedback
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ==========================================================
| Main Page Component
========================================================== */

export default function FeedbackPage() {
    const [windowId, setWindowId] = useState<number>();
    const [selectedWindow, setSelectedWindow] = useState<any>(null);
    const [showServicePopup, setShowServicePopup] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<number>();

    /* Load Windows */
    const {
        data: windows = [],
        isLoading: windowsLoading,
    } = useWindows();

    /* Load Services */
    const {
        data: services = [],
        isLoading: servicesLoading,
    } = useWindowServices(windowId);
    /* Handle Window Click */
    const handleWindowClick = (window: any) => {
        setWindowId(window.id);
        setSelectedWindow(window);
        setShowServicePopup(true);
    };

    /* Handle Service Selection */
    const handleServiceSelect = (serviceId: number) => {
        setSelectedServiceId(serviceId);
        setShowServicePopup(false);
    };

    /* Handle Close Popup */
    const handleClosePopup = () => {
        setShowServicePopup(false);
        setSelectedWindow(null);
        setWindowId(undefined);
    };

    return (
        <div className="container">
            {/* Floating background accents */}
            <div className="bg-circle" style={{ width: 220, height: 220, top: "20%", left: "8%" }} />
            <div className="bg-circle" style={{ width: 160, height: 160, bottom: "15%", right: "10%" }} />

            {/* Header */}
            <div className="header">
                <div className="header-decoration">
                    <span className="decoration-circle" />
                    <span className="decoration-circle" />
                    <span className="decoration-circle" />
                </div>
                <div className="logo-container">
                    <div className="logo-glow" />
                    <div className="logo">
                        <Image
                            src={mesob}
                            alt="Adama MESOB"
                            width={200}
                            height={200}
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                </div>
                <h1 className="title">Adama City Customer Satisfaction Survey</h1>
                <p className="subtitle">Your feedback helps us improve our services</p>
            </div>

            {/* Service Windows Grid */}
            <div className="section">
                <div className="section-title" style={{ justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                        <i><Building className="w-6 h-6" /></i>
                        Select a Service Window
                    </div>
                    <span className="card-badge">{windows.length} windows</span>
                </div>

                {windowsLoading ? (
                    <div className="kiosk-loading">
                        <Loader2 className="w-8 h-8 kiosk-spin" />
                        <span>Loading windows...</span>
                    </div>
                ) : (
                    <div className="cards-container">
                        {windows.map((window: any) => (
                            <div
                                key={window.id}
                                className="card"
                                onClick={() => handleWindowClick(window)}
                            >
                                <div className="card-header">
                                    <div className="card-icon">
                                        <Building className="w-8 h-8" />
                                    </div>
                                    <span className="card-badge">
                                        <Users className="w-3 h-3" style={{ display: "inline", marginRight: 6 }} />
                                        {servicesLoading && windowId === window.id
                                            ? "..."
                                            : services.length || 0}
                                    </span>
                                </div>
                                <div className="card-title">
                                    {window.name || `Foddaa ${window.id}`}
                                </div>
                                <div className="card-subtitle">
                                    {servicesLoading && windowId === window.id
                                        ? "Loading services..."
                                        : `${services.length || 0} services available`}
                                </div>
                                <div className="card-footer">
                                    <button className="card-link">
                                        View services
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <CheckCircle2 className="w-5 h-5" style={{ color: "rgba(61,53,41,.25)" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Service Selection Popup */}
            <ServicePopup
                isOpen={showServicePopup}
                onClose={handleClosePopup}
                window={selectedWindow}
                windowName={selectedWindow?.name}
                services={services}
                onSelectService={handleServiceSelect}
                isLoading={servicesLoading}
            />

            {/* Footer */}
            <p className="kiosk-footnote">
                Your feedback helps us improve our services. Thank you for your time!
            </p>
        </div>
    );
}
