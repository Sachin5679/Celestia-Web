import { useState, useEffect } from "react";
import admin from "../../../services/admin";
import { Attendant } from "../../../types/Data";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import MaterialIcon from "../../../common/MaterialIcon";

export default function TicketPanel(props: { id: string }) {
  const id = props.id.toLowerCase();

  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<Attendant>();
  const [activities, setActivities] = useState<string[]>();

  const navigate = useNavigate();

  async function loadData() {
    setLoading(true);

    try {
      const data = await admin.getTicketById(id);
      if (!data) navigate("/admin");
      setInfo(data);

      setLoading(false);
    } catch {
      navigate("/admin");
    }

    const data = await admin.getActivitiesList();
    setActivities(data.activities);
  }

  async function checkTicket() {
    setLoading(true);
    const data = await admin.checkTicket(id);
    setInfo(data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <section>
      {loading && <>Loading ticket info</>}
      {!loading && info && (
        <div className="flex flex-col items-center gap-y-4">
          <p>
            <span className="text-blue-500 mr-3">ID </span> {info.id}
          </p>
          <p>
            <span className="text-blue-500 mr-3">Name </span>
            {info.name}
          </p>
          <p>
            <span className="text-blue-500 mr-3">Mobile</span> {info.mobile}
          </p>
          <div className="flex justify-center">
            {!info.checked && (
              <button
                className={
                  "w-[10vw] mobile:w-[30vw] aspect-square mt-10 rounded-full flex items-center justify-center bg-green-500 text-black border border-emerald-900"
                }
                onClick={checkTicket}
              >
                <MaterialIcon icon="check" className="text-8xl" />
              </button>
            )}
            {info.checked && (
              <p className="text-red-600">
                This ticket has already been used !
              </p>
            )}
          </div>

          {activities && info.checked && (
            <div className="flex flex-col gap-y-5">
              {activities.map((activity, key) => (
                <div key={key} className="flex gap-x-3">
                  <h5 className="flex-1">{activity}</h5>
                  <input
                    type="text"
                    className="w-20 bg-transparent self-end text-center"
                    value={info.activities[activity]}
                    disabled
                  />
                  <button
                    className="bg-blue-500 px-4 rounded-md text-xl"
                    onClick={async () => {
                      setLoading(true);
                      const data = await admin.activityCountUp(id, activity);
                      setInfo(data);
                      setLoading(false);
                    }}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
