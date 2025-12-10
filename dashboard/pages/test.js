export default function Test() {
    return (
      <div>
        NEXT_PUBLIC_API_URL = {process.env.NEXT_PUBLIC_API_URL || "undefined"}
      </div>
    );
  }
  