import { applyDecorators } from '@nestjs/common';
import { ApiExtension, ApiParam } from '@nestjs/swagger';
import { ApiParamOptions } from '@nestjs/swagger/dist/decorators/api-param.decorator';

/**
 * Sets the method name for the SDK.
 * @param {string} methodName - The name of the method.
 * @returns {Decorator} The decorator to be used on the method.
 */

export function SdkMethodName(methodName: string) {
  return applyDecorators(ApiExtension('x-speakeasy-name-override', methodName));
}

/**
 * Sets the group name for the SDK.
 * @param {string} methodName - The name of the group.
 * @returns {Decorator} The decorator to be used on the method.
 */

export function SdkGroupName(methodName: string) {
  return applyDecorators(ApiExtension('x-speakeasy-group', methodName));
}

/**
 * Ignores the path for the SDK.
 * @param {string} methodName - The name of the method.
 * @returns {Decorator} The decorator to be used on the method.
 */

export function SdkIgnorePath(methodName: string) {
  return applyDecorators(ApiExtension('x-speakeasy-ignore', 'true'));
}

/**
 * Sets the usage example for the SDK.
 * @param {string} title - The title of the example.
 * @param {string} description - The description of the example.
 * @param {number} position - The position of the example.
 * @returns {Decorator} The decorator to be used on the method.
 */

export function SdkUsageExample(title?: string, description?: string, position?: number) {
  return applyDecorators(ApiExtension('x-speakeasy-usage-example', { title, description, position }));
}

/**
 * Sets the maximum number of parameters for the SDK method.
 * @param {number} maxParamsBeforeCollapseToObject - The maximum number of parameters before they are collapsed into an object.
 * @returns {Decorator} The decorator to be used on the method.
 */

export function SdkMethodMaxParamsOverride(maxParamsBeforeCollapseToObject?: number) {
  return applyDecorators(ApiExtension('x-speakeasy-max-method-params', maxParamsBeforeCollapseToObject));
}

class SDKOverrideOptions {
  nameOverride?: string;
}

function overloadOptions(options: ApiParamOptions, sdkOverrideOptions: SDKOverrideOptions) {
  let finalOptions = options;
  if (sdkOverrideOptions.nameOverride) {
    finalOptions = {
      ...finalOptions,
      'x-speakeasy-name-override': sdkOverrideOptions.nameOverride,
    } as unknown as ApiParamOptions;
  }

  return finalOptions as ApiParamOptions;
}

export function SdkApiParam(options: ApiParamOptions, sdkOverrideOptions?: SDKOverrideOptions) {
  const finalOptions = sdkOverrideOptions ? overloadOptions(options, sdkOverrideOptions) : options;

  return applyDecorators(ApiParam(finalOptions));
}

/**
 * Sets the pagination for the SDK.
 * @param {string} override - The override for the limit parameter.
 * @returns {Decorator} The decorator to be used on the method.
 */

export function SdkUsePagination(override?: string) {
  return applyDecorators(
    ApiExtension('x-speakeasy-pagination', {
      type: 'offsetLimit',
      inputs: [
        {
          name: 'page',
          in: 'parameters',
          type: 'page',
        },
        {
          name: override || 'limit',
          in: 'parameters',
          type: 'limit',
        },
      ],
      outputs: {
        results: '$.data.resultArray',
      },
    })
  );
}
