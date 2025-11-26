/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum RoleRole {
  /** 0 */
  Guest = 0,
  /** 1 */
  User = 1,
  /** 2 */
  Moderator = 2,
}

export interface DsCalc {
  inp_dist?: number;
  inp_mass?: number;
  inp_texp?: number;
  res_en?: number;
  res_ni?: number;
  scope_id?: number;
  star_id?: number;
}

export interface DsScope {
  delta_lamb?: number;
  description?: string;
  filter?: string;
  id?: number;
  img_link?: string;
  lambda?: number;
  name?: string;
  status?: boolean;
  zero_point?: number;
}

export interface DsStar {
  constellation?: string;
  creation_date?: string;
  finish_date?: string;
  form_date?: string;
  id?: number;
  mod_id?: number;
  name?: string;
  status?: string;
  user_id?: number;
}

export interface DsUsers {
  id?: number;
  login?: string;
  mod_status?: RoleRole;
  password?: string;
}

export interface HandlerLoginReq {
  guest: boolean;
  login: string;
  password: string;
}

export interface HandlerLoginResp {
  access_token: string;
  expires_in: string;
  login: string;
  role: RoleRole;
  token_type: string;
}

export interface HandlerRegisterReq {
  login: string;
  password: string;
}

export interface HandlerRegisterResp {
  ok: boolean;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://127.0.0.1",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Energy Calculation System
 * @version 1.0
 * @license AS IS (NO WARRANTY)
 * @baseUrl http://127.0.0.1
 * @contact API Support <Barinovartem383@gmail.com> (https://vk.com/aaaaaaeaaaa)
 *
 * Bmstu Open IT Platform
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  calc = {
    /**
     * @description Delete calculation from user's star. If no calculations remain, the star is deleted.
     *
     * @tags Calc
     * @name DeleteDelete
     * @summary Delete calculation from star
     * @request DELETE:/calc/delete/{star_id}/{scope_id}
     */
    deleteDelete: (
      starId: string,
      scopeId: string,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/calc/delete/${starId}/${scopeId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Update calculation parameters in user's star
     *
     * @tags Calc
     * @name EditUpdate
     * @summary Edit calculation in star
     * @request PUT:/calc/edit/{star_id}/{scope_id}
     */
    editUpdate: (
      starId: string,
      scopeId: string,
      input: DsCalc,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/calc/edit/${starId}/${scopeId}`,
        method: "PUT",
        body: input,
        type: ContentType.Json,
        ...params,
      }),
  };
  scope = {
    /**
     * @description Create new scope (moderator only)
     *
     * @tags Scope
     * @name PostScope
     * @summary Add new scope
     * @request POST:/scope/add
     */
    postScope: (scope: DsScope, params: RequestParams = {}) =>
      this.request<DsScope, Record<string, string>>({
        path: `/scope/add`,
        method: "POST",
        body: scope,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Upload image for scope (moderator only)
     *
     * @tags Scope
     * @name AddpictureCreate
     * @summary Add scope picture
     * @request POST:/scope/addpicture/{id}
     */
    addpictureCreate: (
      id: string,
      data: {
        /** Scope image */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/scope/addpicture/${id}`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * @description Add scope to current user's active star
     *
     * @tags Scope
     * @name AddtostarCreate
     * @summary Add scope to star
     * @request POST:/scope/addtostar
     */
    addtostarCreate: (
      data: {
        /** Scope ID */
        scope_id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, void | Record<string, string>>({
        path: `/scope/addtostar`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        ...params,
      }),

    /**
     * @description Delete scope and its image (moderator only)
     *
     * @tags Scope
     * @name DeleteDelete
     * @summary Delete scope
     * @request DELETE:/scope/delete/{id}
     */
    deleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/scope/delete/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Update scope information (moderator only)
     *
     * @tags Scope
     * @name EditUpdate
     * @summary Edit scope
     * @request PUT:/scope/edit/{id}
     */
    editUpdate: (id: string, scope: DsScope, params: RequestParams = {}) =>
      this.request<DsScope, Record<string, string>>({
        path: `/scope/edit/${id}`,
        method: "PUT",
        body: scope,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Get detailed information about specific scope
     *
     * @tags Scope
     * @name ScopeDetail
     * @summary Get scope by ID
     * @request GET:/scope/{id}
     */
    scopeDetail: (id: string, params: RequestParams = {}) =>
      this.request<Record<string, string>, any>({
        path: `/scope/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  scopes = {
    /**
     * @description Get all scopes with optional search filter
     *
     * @tags Scope
     * @name ScopesList
     * @summary Get scopes list
     * @request GET:/scopes
     */
    scopesList: (
      query?: {
        /** Search query */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, any>({
        path: `/scopes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  star = {
    /**
     * @description Get current user's active star ID and calculation count
     *
     * @tags Star
     * @name ActiveList
     * @summary Get active star info
     * @request GET:/star/active
     */
    activeList: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/star/active`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Delete star and redirect to scopes page
     *
     * @tags Star
     * @name DeleteDelete
     * @summary Delete star
     * @request DELETE:/star/delete/{id}
     */
    deleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<any, void | Record<string, string>>({
        path: `/star/delete/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Update star name and constellation
     *
     * @tags Star
     * @name EditUpdate
     * @summary Edit star
     * @request PUT:/star/edit/{id}
     */
    editUpdate: (id: string, input: DsStar, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/star/edit/${id}`,
        method: "PUT",
        body: input,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Complete or deny star (moderator only)
     *
     * @tags Star
     * @name FinishUpdate
     * @summary Finish star
     * @request PUT:/star/finish/{id}
     */
    finishUpdate: (
      id: string,
      input: Record<string, string>,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/star/finish/${id}`,
        method: "PUT",
        body: input,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Change star status to formed and update calculations
     *
     * @tags Star
     * @name FormUpdate
     * @summary Form star
     * @request PUT:/star/form/{id}
     */
    formUpdate: (
      id: string,
      input: Record<string, string>,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/star/form/${id}`,
        method: "PUT",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get detailed star information with all scope calculations
     *
     * @tags Star
     * @name StarDetail
     * @summary Get star with calculations
     * @request GET:/star/{id}
     */
    starDetail: (id: string, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/star/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  stars = {
    /**
     * @description Get stars with role-based access control. - Moderators (modstatus=2): see all stars except "active" and "deleted" statuses - Users (modstatus=1): see only their own stars except "active" and "deleted" statuses - Guests (modstatus=0): access denied (401)
     *
     * @tags Star
     * @name StarsList
     * @summary Get stars list
     * @request GET:/stars
     */
    starsList: (
      query?: {
        /** Status filter (applies to non-active, non-deleted stars) */
        status?: string;
        /** Start date filter (2006-Jan-02) */
        start_date?: string;
        /** End date filter (2006-Jan-02) */
        end_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsStar[], Record<string, string>>({
        path: `/stars`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  user = {
    /**
     * @description Update current user profile (login and password)
     *
     * @tags User
     * @name EditUpdate
     * @summary Update user
     * @request PUT:/user/edit
     */
    editUpdate: (input: DsUsers, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/user/edit`,
        method: "PUT",
        body: input,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description very very friendly response
     *
     * @tags User
     * @name LoginCreate
     * @summary Login the specified user
     * @request POST:/user/login
     */
    loginCreate: (user: HandlerLoginReq, params: RequestParams = {}) =>
      this.request<HandlerLoginResp, void>({
        path: `/user/login`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Logout user and blacklist JWT token
     *
     * @tags User
     * @name LogoutCreate
     * @summary User logout
     * @request POST:/user/logout
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/user/logout`,
        method: "POST",
        ...params,
      }),

    /**
     * @description Get current user profile information
     *
     * @tags User
     * @name ProfileList
     * @summary Get user profile
     * @request GET:/user/profile
     */
    profileList: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/user/profile`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Register new user account
     *
     * @tags User
     * @name RegisterCreate
     * @summary User registration
     * @request POST:/user/register
     */
    registerCreate: (input: HandlerRegisterReq, params: RequestParams = {}) =>
      this.request<HandlerRegisterResp, Record<string, string>>({
        path: `/user/register`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        ...params,
      }),
  };
}
