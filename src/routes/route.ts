import { NextFunction, Request, Response } from "express";


export class BaseRoute {

  protected static baseUrl : string = "/fashion-cache";

  protected static buildUrl(path: string): string { 
    return this.baseUrl + "/" + path; 
  }
  
}