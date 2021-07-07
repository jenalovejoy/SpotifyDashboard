type StringMap<T> = {[key: string]: T};
import { Error } from "./Error";

export function postHeader(container: string, title: string, description: string): void {
    const headerDiv = `<div id="title">
                            ${title}
                        </div>
                        <div id="subtitle">
                            ${description}
                        </div>`
    $(container).append(headerDiv);
}

export function postError(container: string, error: Error): void {
    let image;
    if (error.iconType == "caution"){
        image = "fas fa-exclamation"
    } else {
        image = "fas fa-exclamation-triangle";
    }

    const errorDiv = `<div class="errorBody">
                            <i class="${image}"></i><div class="errorText" title="${error.message}">${error.message}</div>
                      </div>
                      <p>`;

    $(container).append(errorDiv);
}

