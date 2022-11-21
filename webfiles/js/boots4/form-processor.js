////////////////////////////////////////
//
// Universal contact form ajax submission
//
////////////////////////////////////////

$(document).ready(() => {

  if ($('.zform').length) {

    var submitButtonValue = {
      set: ($elm, value) => {
        if ($elm.prop("tagName") === "BUTTON") {
          $elm.html(value);
          return;
        }
        $elm.val(value);
      },
      get: ($elm) => {
        var value = $elm.val()
        if (value === "") {
          return $elm.html();
        }
        return value;
      }
    }

    $('.zform').each((index, value) => {

      let $form = $(value);
      $form.on('submit', (e) => {

        e.preventDefault();

        if ($("#g-recaptcha-response").val() === '') {
          $form.find(".zform-feedback").html('<div class="alert alert-danger alert-dismissible fade show" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Please, verify you are a human!</div>')
          return;
        }

        const $submit = $form.find(":submit");
        const submitText = submitButtonValue.get($submit);
        submitButtonValue.set($submit, "Sending...");


        $.ajax({
          type: 'post',
          url: 'assets/php/form-processor.php',
          data: $form.serialize(), // again, keep generic so this applies to any form
        })
          .done((result) => {
            // if(result.status ==)
            $form.find(".zform-feedback").html(result);
            submitButtonValue.set($submit, submitText);
            window.grecaptcha.reset();
            $form.trigger("reset");
          })
          .fail((xhr) => {
            $form.find(".zform-feedback").html(xhr.responseText);
            submitButtonValue.set($submit, submitText);
          })
      });

    });

  }

});
