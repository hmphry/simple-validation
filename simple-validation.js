/**
 * simple-validation.js
 * copyright (c) 2014 - Chad Humphrey [chdhmphry], http://hmphry.com
 * copyright (c) 2014 - David Myers [drmyersii], https://davidmyers.us
 * open sourced under the MIT license
 * for more information, see https://github.com/chdhmphry/simple-validation
 */

;(function (window)
{
	var SimpleValidator = {
		
		Config: {
			Regex: {
				Email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			},

			Selectors: {
				Forms: 'form',
				FormsToIgnore: '.novalidate,[novalidate]',
				FormElements: 'input[type="text"],input[type="email"],textarea',
				FormElementsToIgnore: '.novalidate,[novalidate]'
			}
		},

		Helpers: {
			MarkAsInvalid: function (formElement)
			{
				formElement.removeClass('valid');
				formElement.addClass('invalid');
			},

			MarkAsValid: function (formElement)
			{
				formElement.removeClass('invalid');
				formElement.addClass('valid');
			},

			ValidateFormElement: function (formElement) // Validates a single formElement
			{
				if (formElement.is('input'))
				{
					switch (formElement.attr('type')) // Check each type and send the input to the correlating validation method.
					{
						case 'text':
							SimpleValidator.Helpers.ValidateFormElementText(formElement);
							break;

						case 'email':
							SimpleValidator.Helpers.ValidateFormElementEmail(formElement);
							break;

						default:
							SimpleValidator.Helpers.ValidateFormElementText(formElement);
							break;
					}
				}
				else if (formElement.is('textarea'))
				{
					SimpleValidator.Helpers.ValidateFormElementText(formElement);
				}
				else
				{
					SimpleValidator.Helpers.ValidateFormElementText(formElement);
				}
			},

			ValidateFormElements: function (formElements) // Validates a group of formElements instead of one at a time.
			{
				formElements.each(function ()
				{
					var formElement = $(this);

					SimpleValidator.Helpers.ValidateFormElement(formElement);
				});
			},

			ValidateFormElementEmail: function (formElement)
			{
				if (SimpleValidator.Config.Regex.Email.test(formElement.val()))
					SimpleValidator.Helpers.MarkAsValid(formElement);
				else
					SimpleValidator.Helpers.MarkAsInvalid(formElement);
			},

			ValidateFormElementText: function (formElement)
			{
				if ('' != formElement.val())
					SimpleValidator.Helpers.MarkAsValid(formElement);
				else
					SimpleValidator.Helpers.MarkAsInvalid(formElement);
			}
		},

		Validate: function () // Initializes event handlers to start validating forms
		{
			// By default, it will not validate forms with the class "novalidate" or the "novalidate" attribute. If you want to disable html5 validation and still use this class, 
			// just remove the [novalidate] attribute from the following line like so: var forms = $('form').not('.novalidate');
			var forms = $(SimpleValidator.Config.Selectors.Forms).not(SimpleValidator.Config.Selectors.FormsToIgnore);

			forms.each(function () // Set the event handlers for each form individually. I may change this to set all handlers at once in the future...
			{
				var form = $(this);
				var formElements = form.find(SimpleValidator.Config.Selectors.FormElements).not(SimpleValidator.Config.Selectors.FormElementsToIgnore); // This will find all the whitelisted form elements to validate and ignore the ones marked as "novalidate"

				formElements.on('blur', function ()
				{
					var formElement = $(this);

					SimpleValidator.Helpers.ValidateFormElement(formElement);
				});

				form.on('submit', function (e) // Only set the handler on forms that need to be validated.
				{
					e.preventDefault(); // Prevents the default submission of the form. This lets us validate before actually submitting the form.
					SimpleValidator.Helpers.ValidateFormElements(formElements); // Do a final validation on formElements since validation is only called on leaving an formElement and the user may not have left the last formElement.

					if (!formElements.is('.invalid')) // If any formElements are marked as invalid, don't submit the form.
						form.unbind('submit').trigger('submit'); // Unbind this form submit event and then resubmit since the form is valid.
				});
			});
		}
	}

	window.SimpleValidator = SimpleValidator;
})(window);

window.SimpleValidator.Validate();