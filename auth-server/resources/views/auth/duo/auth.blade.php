<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <script src="https://api.duosecurity.com/frame/hosted/Duo-Web-v2.js"></script>
            <script>
              Duo.init({
                'host': '{{ $host }}',
                'sig_request': '{{ $sig_request }}',
              });
            </script>
            <iframe id="duo_iframe">
            </iframe>
            <form id="duo_form" method="post">
                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                <input type="hidden" name="user_id" value="{{ $user_id }}">
            </form>
            <style>
                #duo_iframe {
                    width: 100%;
                    min-width: 304px;
                    max-width: 620px;
                    height: 330px;
                    border: none;
                }
            </style>
        </div>
    </div>
</div>
