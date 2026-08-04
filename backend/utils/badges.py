from models import db
from models.user import User

def award_badge(user_id, badge_path):
    """
    Safely appends a new badge to the user's profile.
    Usage: award_badge(current_user_id, "media/badge2.png")
    """
    user = User.query.get(user_id)
    
    if not user:
        return False
        
    current_badges = user.badges.split(",") if user.badges else []
    
    if badge_path not in current_badges:
        current_badges.append(badge_path)
        user.badges = ",".join(current_badges)
        db.session.commit()
        return True
        
    return False