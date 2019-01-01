const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default (emails) => {
  if (!emails) { return; }

  const invalidEmails = emails
    .split(',')
    .reduce((acc, email) => {
      const trimmedEmail = email.trim();
      
      // Add bad emails to output array
      if(!regex.test(trimmedEmail)) {
        return [ ...acc, trimmedEmail];
      } 

      return acc;
    }, []);

    if (invalidEmails.length) {
      return `These emails are invalid: ${invalidEmails}`
    }
}