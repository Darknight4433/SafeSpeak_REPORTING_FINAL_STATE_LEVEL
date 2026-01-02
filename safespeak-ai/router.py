def route_report(score: int) -> dict:
    """
    Step 7 & 9: Assign Risk Level & Routing
    """
    if score <= 30:
        return {"level": "L0", "action": "Log only / Prank check", "target": "System"}
    elif score <= 50:
        return {"level": "L1", "action": "Refer to Counselor", "target": "Counselor"}
    elif score <= 75:
        return {"level": "L2", "action": "Alert School Authority", "target": "Principal"}
    else:
        return {"level": "L3", "action": "Immediate Child Protection Alert", "target": "Child Protection Services"}
