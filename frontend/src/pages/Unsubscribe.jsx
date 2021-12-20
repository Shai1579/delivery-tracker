import { useEffect, useState } from "react";
import axios from "axios";
import queryString from "query-string";

export function Unsubscribe(props) {
  const [removed, setRemoved] = useState(20);

  useEffect(() => {
    const deleteMailingList = async () => {
      const query = queryString.parse(props.location.search);
      if (query.email) {
        try {
          await axios({
            url: `https://home-made-cookers-app.herokuapp.com/emails/from-mailing-list`,
            method: "DELETE",
            data: { email: query.email},
          });
          setRemoved(1);
        } catch (e) {
          setRemoved(0);
        }
      }
    };
    deleteMailingList();
  }, []);
  let textToShow = "טוען...";
  switch (removed) {
    case 0:
      textToShow = "שגיאה בהסרה מרשימת התפוצה, אנא פנה ל077-955-5692";
      break;
    case 1:
      textToShow = "הוסרת בהצלחה מרשימת התפוצה";
      break;
    default:
      break;
  }
  return <div className="payment-container">{textToShow}</div>;
}
