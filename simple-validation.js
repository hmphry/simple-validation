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
				FormElements: 'input,select,textarea',
				FormElementsToIgnore: '.novalidate,[novalidate]'
			}
		},

		Helpers: {
			GetForms: function ()
			{
				var forms = $(SimpleValidator.Config.Selectors.Forms).not(SimpleValidator.Config.Selectors.FormsToIgnore);

				return forms;
			},

			GetFormElements: function (form)
			{
				var formElements = form.find(SimpleValidator.Config.Selectors.FormElements).not(SimpleValidator.Config.Selectors.FormElementsToIgnore); // This will find all the whitelisted form elements to validate and ignore the ones marked as "novalidate"

				return formElements;
			},

			InitializeForm: function (form)
			{
				var formElements = SimpleValidator.Helpers.GetFormElements(form);

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

				form.attr('novalidate', true);
			},

			InitializeForms: function (forms)
			{
				forms.each(function ()
				{
					var form = $(this);

					SimpleValidator.Helpers.InitializeForm(form);
				});
			},

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

			ValidateForm: function (form)
			{
				var formElements = SimpleValidator.Helpers.GetFormElements(form);

				SimpleValidator.Helpers.ValidateFormElements(formElements);
			},

			ValidateForms: function (forms)
			{
				forms.each(function ()
				{
					var form = $(this);

					SimpleValidator.Helpers.ValidateForm(form);
				});
			},

			ValidateFormElement: function (formElement) // Validates a single formElement
			{
				if (formElement.is('input'))
				{
					switch (formElement.attr('type')) // Check each type and send the input to the correlating validation method.
					{
						case 'button':
							// There is no reason to validate a button type, but I just wanted to have all the html5 types in here...
							break;

						case 'checkbox':
							SimpleValidator.Helpers.ValidateFormElementCheckbox(formElement);
							break;

						case 'color':
							break;

						case 'date':
							break;

						case 'datetime':
							break;

						case 'datetime-local':
							break;

						case 'email':
							SimpleValidator.Helpers.ValidateFormElementEmail(formElement);
							break;

						case 'file':
							break;

						case 'hidden':
							break;

						case 'image':
							break;

						case 'month':
							break;

						case 'number':
							break;

						case 'password':
							break;

						case 'radio':
							break;

						case 'range':
							break;

						case 'reset':
							break;

						case 'search':
							break;

						case 'submit':
							break;

						case 'tel':
							break;

						case 'text':
							SimpleValidator.Helpers.ValidateFormElementText(formElement);
							break;

						case 'time':
							break;

						case 'url':
							break;

						case 'week':
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
				else if (formElement.is('select'))
				{
					
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

			ValidateFormElementCheckbox: function (formElement)
			{
				var isRequired = false;
				var name = formElement.attr('name');
				var family = formElement.closest(SimpleValidator.Config.Selectors.Forms).find('input[type="checkbox"][name="' + name + '"]').not(SimpleValidator.Config.Selectors.FormElementsToIgnore);

				console.log(family);
				console.log(formElement.is(':checked'));
				console.log(family.is(':checked'));

				if (formElement.is('[required]') || family.is('[required]'))
					isRequired = true;

				if (isRequired && !formElement.is(':checked') && !family.is(':checked'))
					return SimpleValidator.Helpers.MarkAsInvalid(formElement);
				else
					return SimpleValidator.Helpers.MarkAsValid(formElement);
			},

			ValidateFormElementEmail: function (formElement)
			{
				var isRequired = formElement.is('[required]');

				if (isRequired && !formElement.value)
					return SimpleValidator.Helpers.MarkAsInvalid(formElement);

				if (SimpleValidator.Config.Regex.Email.test(formElement.value) || !formElement.value)
					return SimpleValidator.Helpers.MarkAsValid(formElement);
				else
					return SimpleValidator.Helpers.MarkAsInvalid(formElement);
			},

			ValidateFormElementText: function (formElement)
			{
				var isRequired = formElement.is('[required]');

				if (isRequired && !formElement.value)
					return SimpleValidator.Helpers.MarkAsInvalid(formElement);

				return SimpleValidator.Helpers.MarkAsValid(formElement);
			}
		},

		Initialize: function () // Initializes event handlers to start validating forms
		{
			var forms = SimpleValidator.Helpers.GetForms();

			SimpleValidator.Helpers.InitializeForms(forms);
		},

		Validate: function () // Forces global validation of forms.
		{
			var forms = SimpleValidator.Helpers.GetForms();

			SimpleValidator.Helpers.ValidateForms(forms);
		}
	}

	window.SimpleValidator = SimpleValidator;
})(window);

window.SimpleValidator.Initialize(); // This call will initialize all event handlers. 