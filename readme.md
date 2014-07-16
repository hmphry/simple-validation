simple-validation (refactored by David Myers)
=================

Extremely simple form validation with JQuery. Checks if text inputs are filled and if email inputs contain valid email on un-focus or submit. I will soon add support for other elements as well!


~~Add `.validate-form` on forms that you'd like to be validated, and `.validate` on the inputs you'd liked checked. You can use this multiple times on the same page.~~
Now, it will validate all forms unless told not to. In order to have a form not validated, you can either add the class `novalidate` or you can add the attribute `novalidate` to the form element. Also, in order to specify a specific input in a form to not be validated, you can do the same; add the class `novalidate` or the attribute `novalidate` to the specified form input and it will not be validated.


## Road Map

Add support for other form elements such as checkboxes, radio buttons, and dropdowns.
