export default function LoginModal({ onClose }) {
  return (
    <div
      className="gate"
      onClick={(e) => {
        if (e.target.classList.contains("gate")) onClose();
      }}
      style={{ zIndex: 9999 }}
    >
      <div className="panel" style={{ maxWidth: 400 }}>
        <h3 style={{ marginBottom: 12 }}>ログイン</h3>

        <button
          className="btnDark"
          style={{ width: "100%", marginBottom: 20 }}
          onClick={async () => {
            try {
              const res = await fetch(
                "https://ms-engine-test.sinnosukeyamane.workers.dev/persona/login-request",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ redirect: window.location.href }),
                }
              );

              const data = await res.json();
              if (data.url) window.location.href = data.url;
            } catch (err) {
              console.error(err);
              alert("通信エラー");
            }
          }}
        >
          Googleでログイン
        </button>

        <button className="btn" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
}
