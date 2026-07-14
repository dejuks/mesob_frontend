"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import feedbackService from "@/services/feedback.service";
import type { Gender } from "@/types/feedback";




type FeedbackFormState = {

    service_id: string;

    overall_rating: number;

    staff_behavior: number;

    waiting_time: number;

    service_quality: number;

    cleanliness: number;

    satisfaction:
        | "highly_satisfied"
        | "satisfied"
        | "not_satisfied";

    comment: string;

    gender: Gender;

    age: string;

};



export default function FeedbackForm() {


    const router = useRouter();


    const [loading,setLoading] = useState(false);



    const [form,setForm] = useState<FeedbackFormState>({

        service_id:"",

        overall_rating:5,

        staff_behavior:5,

        waiting_time:5,

        service_quality:5,

        cleanliness:5,

        satisfaction:"highly_satisfied",

        comment:"",

        gender:"",

        age:""

    });





    function updateField<K extends keyof FeedbackFormState>(

        field: K,

        value: FeedbackFormState[K]

    ){

        setForm(prev => ({

            ...prev,

            [field]: value

        }));

    }





    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ){

        e.preventDefault();


        setLoading(true);


        try {


            await feedbackService.create({

                service_id:Number(form.service_id),

                overall_rating:form.overall_rating,

                staff_behavior:form.staff_behavior,

                waiting_time:form.waiting_time,

                service_quality:form.service_quality,

                cleanliness:form.cleanliness,

                satisfaction:form.satisfaction,

                comment:form.comment,

                gender:form.gender || undefined,

                age:Number(form.age)

            });



            router.push(
                "/feedback/success"
            );


        } catch(error){


            console.error(
                "Feedback submit error:",
                error
            );


        } finally {


            setLoading(false);


        }

    }





    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >


            <select

                value={form.service_id}

                onChange={(e)=>
                    updateField(
                        "service_id",
                        e.target.value
                    )
                }

                className="border p-2 w-full"

                required

            >

                <option value="">
                    Select Service
                </option>

                <option value="1">
                    Service One
                </option>

                <option value="2">
                    Service Two
                </option>

            </select>





            <input

                type="number"

                min={1}

                max={5}

                value={form.overall_rating}

                onChange={(e)=>
                    updateField(
                        "overall_rating",
                        Number(e.target.value)
                    )
                }

                className="border p-2 w-full"

            />





            <select

                value={form.satisfaction}

                onChange={(e)=>
                    updateField(
                        "satisfaction",
                        e.target.value as FeedbackFormState["satisfaction"]
                    )
                }

                className="border p-2 w-full"

            >

                <option value="highly_satisfied">
                    Highly Satisfied
                </option>


                <option value="satisfied">
                    Satisfied
                </option>


                <option value="not_satisfied">
                    Not Satisfied
                </option>


            </select>





            <select

                value={form.gender}

                onChange={(e)=>
                    updateField(
                        "gender",
                        e.target.value as Gender
                    )
                }

                className="border p-2 w-full"

            >

                <option value="">
                    Select Gender
                </option>


                <option value="male">
                    Male
                </option>


                <option value="female">
                    Female
                </option>


            </select>





            <input

                type="number"

                placeholder="Age"

                value={form.age}

                onChange={(e)=>
                    updateField(
                        "age",
                        e.target.value
                    )
                }

                className="border p-2 w-full"

            />





            <textarea

                placeholder="Comment"

                value={form.comment}

                onChange={(e)=>
                    updateField(
                        "comment",
                        e.target.value
                    )
                }

                className="border p-2 w-full"

            />





            <button

                type="submit"

                disabled={loading}

                className="bg-blue-600 text-white px-5 py-2 rounded"

            >

                {
                    loading
                        ?
                        "Submitting..."
                        :
                        "Submit Feedback"
                }

            </button>


        </form>

    );

}