import { APIGatewayEvent, Context as AWSContext, Callback as AWSCallback, Handler as AWSHandler } from "aws-lambda";

export interface Event extends APIGatewayEvent {
    rawUrl: string;
}

export interface Context extends AWSContext {

}

export interface Callback extends AWSCallback {

}

export interface Handler extends AWSHandler {

}