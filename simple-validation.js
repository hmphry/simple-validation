// Simple Validation - By Chad Humphrey - hmphry.com
// simple-validation.js - Completely Refactored By David Myers (drmyersii) - davidmyers.us
// Open Sourced Under the MIT License

var ValidateForms = function () // validates all forms
{
	var DetermineValidation = function (input, condition) // This will set the input to valid if the passed condition is true, so please format the conditions accordingly.
	{
		if (condition)
		{
			input.removeClass('invalid');
			input.addClass('valid');
		}
		else
		{
			input.removeClass('valid');
			input.addClass('invalid');
		}
	}

	var ValidateTextInput = function (input) // This will make sure there is something entered in the form.
	{
		DetermineValidation(input, ('' != input.val()));
	}

	var ValidateEmailInput = function (input) // This will make sure an email is formatted correctly.
	{
		var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		DetermineValidation(input, (input.val().match(regex)));
	}

	var ValidateInput = function (input)
	{
		switch (input.attr('type')) // Check each type and send the input to the correlating validation method.
		{
			case 'text':
				ValidateTextInput(input);
				break;

			case 'email':
				ValidateEmailInput(input);
				break;

			default:
				ValidateTextInput(input);
				break;
		}
	}

	var ValidateInputs = function (inputs) // Validates a group of inputs instead of one at a time.
	{
		inputs.each(function ()
		{
			var input = $(this);

			ValidateInput(input);
		});
	}

	// By default, it will not validate forms with the class "novalidate" or the "novalidate" attribute. If you want to disable html5 validation and still use this class, 
	// just remove the [novalidate] attribute from the following line like so: var forms = $('form').not('.novalidate');
	var forms = $('form').not('.novalidate,[novalidate]');

	forms.each(function () // Set the event handlers for each from individually. I may change this to set all handlers at once in the future...
	{
		var form = $(this);
		var inputs = form.find('input[type="text"],input[type="email"],textarea').not('.novalidate,[novalidate]'); // This will find all the whitelisted form elements to validate and ignore the ones marked as "novalidate"

		inputs.on('blur', function ()
		{
			var input = $(this);

			ValidateInput(input);
		});

		form.on('submit', function (e) // Only set the handler on forms that need to be validated.
		{
			e.preventDefault(); // Prevents the default submission of the form. This lets us validate before actually submitting the form.
			ValidateInputs(inputs); // Do a final validation on inputs since validation is only called on leaving an input and the user may not have left the last input.

			if (!inputs.is('.invalid')) // If any inputs are marked as invalid, don't submit the form.
				form.unbind('submit').trigger('submit'); // Unbind this form submit event and then resubmit since the form is valid.
		});
	});
}

ValidateForms();