import api, { unwrap } from "@/lib/api";

import { useQuery } from "@tanstack/react-query";

import type {
    Feedback,
    FeedbackFilters,
    FeedbackListResponse,
    FeedbackPayload,
    FeedbackResponse,
    Service,
    ServiceResponse,
    Window,
    WindowResponse,
} from "@/types/feedback";



export const feedbackKeys = {

    all: ["feedback"] as const,

    list: (filters?: FeedbackFilters) =>
        ["feedback", "list", filters] as const,

    detail: (id:number) =>
        ["feedback", "detail", id] as const,

    services: (windowId?:number) =>
        ["feedback", "services", windowId] as const,

};



class FeedbackService {


    private readonly feedbackUrl = "/feedback";

    private readonly windowsUrl = "/windows";



    /*
    |--------------------------------------------------------------------------
    | WINDOWS
    |--------------------------------------------------------------------------
    */


    async getWindows():Promise<Window[]> {


        const response =
            await api.get(
                this.windowsUrl
            );


        return unwrap<WindowResponse>(
            response
        ).data;

    }



    /*
    |--------------------------------------------------------------------------
    | SERVICES BY WINDOW
    |--------------------------------------------------------------------------
    */


    async getServicesByWindow(
        windowId:number
    ):Promise<Service[]> {


        const response =
            await api.get(
                `${this.windowsUrl}/${windowId}/services`
            );


        return unwrap<ServiceResponse>(
            response
        ).data;

    }





    /*
    |--------------------------------------------------------------------------
    | LIST
    |--------------------------------------------------------------------------
    */


    async getAll(
        filters?:FeedbackFilters
    ):Promise<FeedbackListResponse>{


        const response =
            await api.get(
                this.feedbackUrl,
                {
                    params:filters
                }
            );


        return unwrap<FeedbackListResponse>(
            response
        );

    }





    /*
    |--------------------------------------------------------------------------
    | SINGLE
    |--------------------------------------------------------------------------
    */


    async getById(
        id:number
    ):Promise<Feedback>{


        const response =
            await api.get(
                `${this.feedbackUrl}/${id}`
            );


        return unwrap<FeedbackResponse>(
            response
        ).data;

    }





    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */


    async create(
        payload:FeedbackPayload
    ):Promise<Feedback>{


        const response =
            await api.post(
                this.feedbackUrl,
                payload
            );


        return unwrap<FeedbackResponse>(
            response
        ).data;

    }





    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */


    async update(
        id:number,
        payload:Partial<FeedbackPayload>
    ):Promise<Feedback>{


        const response =
            await api.put(
                `${this.feedbackUrl}/${id}`,
                payload
            );


        return unwrap<FeedbackResponse>(
            response
        ).data;

    }





    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */


    async delete(
        id:number
    ):Promise<void>{


        await api.delete(
            `${this.feedbackUrl}/${id}`
        );

    }





    /*
    |--------------------------------------------------------------------------
    | FILTER
    |--------------------------------------------------------------------------
    */


    async filter(
        filters:FeedbackFilters
    ):Promise<FeedbackListResponse>{


        const response =
            await api.get(
                this.feedbackUrl,
                {
                    params:filters
                }
            );


        return unwrap<FeedbackListResponse>(
            response
        );

    }





    async dashboard(
        filters?:FeedbackFilters
    ):Promise<FeedbackListResponse>{


        return this.getAll(filters);

    }


}




const feedbackService =
    new FeedbackService();




/*
|--------------------------------------------------------------------------
| React Query Hooks
|--------------------------------------------------------------------------
*/


export function useWindows(){


    return useQuery<Window[]>({

        queryKey:[
            "feedback",
            "windows"
        ],


        queryFn:
            ()=>feedbackService.getWindows()

    });


}





export function useWindowServices(
    windowId?:number
){


    return useQuery<Service[]>({


        queryKey:
            feedbackKeys.services(
                windowId
            ),


        queryFn:
            ()=>feedbackService
                .getServicesByWindow(
                    windowId!
                ),


        enabled:
            !!windowId

    });


}





export function useFeedback(
    filters?:FeedbackFilters
){


    return useQuery<FeedbackListResponse>({


        queryKey:
            feedbackKeys.list(
                filters
            ),


        queryFn:
            ()=>feedbackService
                .getAll(
                    filters
                )


    });


}





export function useFeedbackDetails(
    id:number
){


    return useQuery<Feedback>({


        queryKey:
            feedbackKeys.detail(
                id
            ),


        queryFn:
            ()=>feedbackService
                .getById(
                    id
                ),


        enabled:
            !!id


    });


}





export function useFilteredFeedback(
    filters:FeedbackFilters
){


    return useQuery<FeedbackListResponse>({


        queryKey:[
            "feedback-filter",
            filters
        ],


        queryFn:
            ()=>feedbackService
                .filter(
                    filters
                )


    });


}



export default feedbackService;