const androidLink = "https://play.google.com/store/apps/details?id=app.bravostudio.A01EX22AWQH8PY08J5Q28FDYSS5";
const appleLink = "https://apps.apple.com/il/app/homemade-%D7%9E%D7%A9%D7%9C%D7%95%D7%97%D7%99-%D7%90%D7%95%D7%9B%D7%9C-%D7%91%D7%99%D7%AA%D7%99/id1552706061";

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
    if (/android/i.test(userAgent)) {
        return "Android";
    }
  
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }
  
    return "unknown";
  }

  function redirectToStore() {
      const deviceType = getMobileOperatingSystem();
      let url = null;
      if (deviceType === "Android") {
          url = androidLink;
      }
      if (deviceType === "iOS") {
          url = appleLink;
      }
      if (url) {
        window.location.href = url;
      }
  }
export function Share() {
    function htmlDecode(html) {
        return html.replace(/&([a-z]+);/ig, (match, entity) => {
          const entities = { amp: '&', apos: '\'', gt: '>', lt: '<', nbsp: '\xa0', quot: '"' };
          entity = entity.toLowerCase();
          if (entities.hasOwnProperty(entity)) {
            return entities[entity];
          }
          return match;
        });
      }
    const facebookPixel = `<!-- Facebook Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '628111641320536');
    fbq('track', 'PageView');
    </script>
    <!-- End Facebook Pixel Code -->
    
    <script>
      fbq('track', 'Lead');
    </script>`;
      return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: htmlDecode(facebookPixel)}}/>
            <img height="1" width="1" style={{"display":"none"}} alt="nothing"
    src="https://www.facebook.com/tr?id=628111641320536&ev=PageView&noscript=1"
    />
            <p>{redirectToStore()}</p>
        </div>
    )
}