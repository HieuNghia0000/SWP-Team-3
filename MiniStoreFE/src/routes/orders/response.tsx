import { createSignal, createEffect } from "solid-js";
import { useLocation } from "solid-start";
import Breadcrumbs from "~/components/Breadcrumbs";
import routes from "~/utils/routes";

export default function OrdersResponse() {
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");

    const [paymentStatus, setPaymentStatus] = createSignal("");

    createEffect(() => {
        if (vnp_ResponseCode === "00") {
            setPaymentStatus("Payment Success");
        } else {
            setPaymentStatus("Payment Failed");
        }
    });

    return (
        <main class="min-w-fit">
            <h1 class="mb-2 text-2xl font-medium">Orders Response</h1>
            <Breadcrumbs
                linkList={[
                    { name: "Orders", link: routes.orders },
                    { name: "Response" },
                ]}
            />

            <div>
                <h2>{paymentStatus()}</h2>
            </div>
        </main>
    );
}
