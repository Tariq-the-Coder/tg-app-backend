exports.calculateExpiration = (tier) => {
    const now = new Date();
    if (tier === "day") now.setDate(now.getDate() + 1);
    if (tier === "week") now.setDate(now.getDate() + 7);
    if (tier === "month") now.setMonth(now.getMonth() + 1);
    return now;
  };
  