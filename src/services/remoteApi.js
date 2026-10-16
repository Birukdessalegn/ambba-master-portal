export async function fetchClientStatus(client) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    let baseUrl = client.apiUrl.replace(/\/+$/, "");
    // If user provided URL already ending with /api, normalize it
    const statusUrl = baseUrl.endsWith("/api")
      ? `${baseUrl}/subscription/status`
      : `${baseUrl}/api/subscription/status`;

    const res = await fetch(statusUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        online: false,
        error: `HTTP ${res.status} ${res.statusText}`,
        status: "offline",
      };
    }

    const json = await res.json();
    return {
      online: true,
      error: null,
      ...json.data,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      online: false,
      error: err.name === "AbortError" ? "Connection Timed Out" : "Server Unreachable",
      status: "offline",
    };
  }
}

export async function renewClientRemote(client, { days, newExpiryDate, notes, isSuspended = false, masterPin, vendorKey }) {
  try {
    let baseUrl = client.apiUrl.replace(/\/+$/, "");
    const renewUrl = baseUrl.endsWith("/api")
      ? `${baseUrl}/subscription/renew`
      : `${baseUrl}/api/subscription/renew`;

    // Priority: Explicit vendorKey -> client.vendorKey -> session PIN
    const keyToSend = vendorKey || client.vendorKey;
    const pinToSend = masterPin || sessionStorage.getItem("ambba_active_pin") || undefined;

    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    if (keyToSend) {
      headers["X-Vendor-Key"] = keyToSend;
    }

    const res = await fetch(renewUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        days,
        newExpiryDate,
        notes: notes || "Renewed remotely via AmbbaTech Master Portal",
        masterPin: pinToSend,
        isSuspended,
      }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return {
        success: false,
        message: json.message || `Renewal failed with status ${res.status}`,
      };
    }

    return {
      success: true,
      data: json.data,
      message: json.message || "Subscription renewed successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "Failed to connect to client server",
    };
  }
}
