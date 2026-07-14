// src/types/feedback.ts


/* ============================================================
 * Enums
 * ============================================================ */

export type Satisfaction =
    | "highly_satisfied"
    | "satisfied"
    | "not_satisfied";


export type Gender =
    | "male"
    | "female"
    | "";



/* ============================================================
 * Window
 * ============================================================ */

export interface Window {

    id:number;

    name:string;

}



/* ============================================================
 * Service
 * ============================================================ */

export interface Service {

    id:number;

    name:string;

    description?:string;

}



/* ============================================================
 * Location
 * ============================================================ */

export interface LocationRef {

    id:number;

    name:string;

}


export interface FeedbackLocation {

    city:LocationRef | null;

    subcity:LocationRef | null;

    woreda:LocationRef | null;

}



export interface SubmittedBy {

    id:number;

    name:string;

}



/* ============================================================
 * Feedback
 * ============================================================ */

export interface Feedback {


    id:number;


    service_id:number;


    service?:Service;



    location?:FeedbackLocation;



    submitted_by?:SubmittedBy | null;



    overall_rating:number;


    staff_behavior:number | null;


    waiting_time:number | null;


    service_quality:number | null;


    cleanliness:number | null;



    satisfaction:Satisfaction;



    comment:string | null;



    gender?:Exclude<Gender, "">;



    age:number | null;



    ip_address?:string | null;


    user_agent?:string | null;


    device?:string | null;



    created_at:string;


    updated_at:string;


}



/* ============================================================
 * Create Feedback Payload
 * ============================================================ */

export interface FeedbackPayload {


    service_id:number;



    overall_rating:number;



    staff_behavior?:number;



    waiting_time?:number;



    service_quality?:number;



    cleanliness?:number;



    satisfaction:
        | "highly_satisfied"
        | "satisfied"
        | "not_satisfied";



    comment?:string;



    gender?:
        | "male"
        | "female";



    age?:number;


}



/* ============================================================
 * Update Feedback
 * ============================================================ */

export interface UpdateFeedbackPayload
    extends Partial<FeedbackPayload> {}



/* ============================================================
 * Filters
 * ============================================================ */

export interface FeedbackFilters {


    city_id?:number;


    subcity_id?:number;


    woreda_id?:number;


    service_id?:number;


    rating?:number;


    satisfaction?:
        | "highly_satisfied"
        | "satisfied"
        | "not_satisfied";


    date?:string;


    page?:number;


    per_page?:number;


}



/* ============================================================
 * Pagination
 * ============================================================ */

export interface PaginationLink {


    url:string | null;


    label:string;


    active:boolean;


}



export interface PaginationMeta {


    current_page:number;


    from:number | null;


    last_page:number;


    per_page:number;


    total:number;


    path:string;


    to:number | null;


    links:PaginationLink[];


}



export interface PaginationLinks {


    first:string | null;


    last:string | null;


    prev:string | null;


    next:string | null;


}



/* ============================================================
 * API Response
 * ============================================================ */

export interface FeedbackResponse {


    success:boolean;


    message:string;


    data:Feedback;


}



export interface FeedbackListResponse {


    data:Feedback[];


    links:PaginationLinks;


    meta:PaginationMeta;


}



/* ============================================================
 * Window Response
 * ============================================================ */

export interface WindowResponse {


    success:boolean;


    data:Window[];


}



/* ============================================================
 * Service Response
 * ============================================================ */

export interface ServiceResponse {


    success:boolean;


    data:Service[];


}