		try {
			$.datepicker.parseDate('{VALUE}', {DATA});
		}
		catch(er) {
			{ERROR} = { message: '{NAME} must be date as {VALUE}'};
		}