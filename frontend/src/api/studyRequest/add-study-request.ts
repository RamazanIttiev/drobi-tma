import axios from "axios";
import { API_URL } from "@/common/constants.ts";

interface StudyRequest {
  fullName: string;
  eMail?: string;
  phone: string;
}

interface StudyRequestSuccessResponse {
  status: string;
  message: string;
  id: string;
}

interface StudyRequestErrorResponse {
  status: string;
  message: string;
}

type StudyRequestResponse =
  | StudyRequestSuccessResponse
  | StudyRequestErrorResponse;

export const addStudyRequestFromApi = async (
  payload: StudyRequest,
): Promise<StudyRequestResponse | undefined> => {
  try {
    const response = await axios.post(`${API_URL}/addStudyRequest`, payload);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
