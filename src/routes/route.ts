import { NextFunction, Request, Response } from "express";


export class BaseRoute {

  protected title: string;

  constructor() {
    this.title = "Fashion Test";
  }
  
}