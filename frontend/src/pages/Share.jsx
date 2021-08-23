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
      return (
        <div>
            <p>{redirectToStore()}</p>
        </div>
    )
}