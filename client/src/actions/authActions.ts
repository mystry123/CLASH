"use server";

import axios, { AxiosError } from "axios";
import {
  FORGET_PASSWORD_URL,
  LOGIN_URL,
  REGISTER_URL,
  RESET_PASSWORD_URL,
  VERIFY_CREDENTIALS_URL,
} from "@/lib/apiEndPoint";


export const registerAction = async (prevState: any, formdata: any) => {
  try {
    await axios.post(REGISTER_URL, {
      username: formdata.get("name"),
      email: formdata.get("email"),
      password: formdata.get("password"),
      confirmPassword: formdata.get("confirmPassword"),
    });
    return {
      status: 500,
      message: "Account created successfully",
      errors: {},
    };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        return {
          status: 422,
          message: error.response?.data?.message,
          errors: error.response?.data?.errors,
        };
      }
    }
    return {
      status: error.response?.status,
      message: error.response?.message,
      errors: {},
    };
  }
};

//  login action
export const loginAction = async (prevState: any, formdata: any) => {
  try {
    await axios.post(VERIFY_CREDENTIALS_URL, {
      email: formdata.get("email"),
      password: formdata.get("password"),
    });
    return {
      status: 200,
      message: "Login successful",
      errors: {},
      data: {
        email: formdata.get("email"),
        password: formdata.get("password"),
      },
    };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        return {
          status: 422,
          message: error.response?.data?.message,
          errors: error.response?.data?.errors,
          data: {},
        };
      }
    }
    return {
      status: error.response?.status,
      message: error.response?.message,
      errors: {},
      data: {},
    };
  }
};

// forget password action

export const forgotPasswordAction = async (prevState: any, formdata: any) => {
  try {
    await axios.post(FORGET_PASSWORD_URL, {
      email: formdata.get("email"),
    });
    return {
      status: 200,
      message: "Link send successful , check your email",
      errors: {},
    };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        return {
          status: 422,
          message: error.response?.data?.message,
          errors: error.response?.data?.errors,
        };
      }
    }
    return {
      status: error.response?.status,
      message: error.response?.message,
      errors: {},
    };
  }
};

// reset password action

export const resetPasswordAction = async (prevState: any, formdata: any) => {
  try {
    console.log("formdata", formdata);
    await axios.post(RESET_PASSWORD_URL, {
      email: formdata.get("email"),
      token: formdata.get("token"),
      password: formdata.get("password"),
      confirmPassword: formdata.get("confirmPassword"),
    });
    return {
      status: 200,
      message: "Password Reset Succesfullyl",
      errors: {},
    };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        return {
          status: 422,
          message: error.response?.data?.message,
          errors: error.response?.data?.errors,
        };
      }
    }
    return {
      status: error.response?.status,
      message: error.response?.message,
      errors: {},
    };
  }
};
