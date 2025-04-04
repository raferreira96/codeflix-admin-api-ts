import {FieldsErrors} from "../../domain/validators/validator-fields.interface";
import {ClassValidatorFields} from "../../domain/validators/class-validator-fields";
import {EntityValidationError} from "../../domain/validators/validation.error";
import {Notification} from "../../domain/validators/notification";

// type Expected = {
//     validator: ClassValidatorFields<any>;
//     data: any;
// } | (() => any );
//
// expect.extend({
//     containsErrorMessages(expected: Expected, received: FieldsErrors) {
//         if (typeof expected === 'function') {
//             try {
//                 expected();
//                 return isValid();
//             } catch (e) {
//                 const error = e as EntityValidationError;
//                 return assertContainsErrorsMessages(error.errors, received);
//             }
//         } else {
//             const {validator, data} = expected;
//             const validated = validator.validate(data);
//             if (validated) {
//                 return isValid();
//             }
//             return assertContainsErrorsMessages(validator.errors, received);
//         }
//     }
// });

expect.extend({
    notificationContainsErrorMessages(
        expected: Notification,
        received: Array<string | { [key: string]: string[] }>,
    ) {
        const every = received.every((error) => {
            if (typeof error === 'string') {
                return expected.errors.has(error);
            } else {
                return Object.entries(error).every(([field, messages]) => {
                    const fieldMessages = expected.errors.get(field) as string[];

                    return (
                        fieldMessages &&
                        fieldMessages.length &&
                        fieldMessages.every((message) => messages.includes(message))
                    );
                });
            }
        });
        return every
            ? isValid()
            : {
                pass: false,
                message: () => `The validation errors not contains ${JSON.stringify(received)}. Current: ${JSON.stringify(expected.errors)}`,
            };
    }
});

// function assertContainsErrorsMessages(expected: FieldsErrors, received: FieldsErrors) {
//     const isMatch = expect.objectContaining(received).asymmetricMatch(expected);
//
//     return isMatch
//         ? isValid()
//         : { pass: false, message: () => `The validation errors not contains ${JSON.stringify(received)}. Current: ${JSON.stringify(expected)}.` };
// }

function isValid() {
    return { pass: true, message: () => '' };
}