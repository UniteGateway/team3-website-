"""Create the WEEKEND_ADMIN_HASH value for Weekend News Studio sign-in.

Usage: python3 build/weekend_password.py   (prompts for the password; nothing is stored)
Then set in Vercel -> Project -> Settings -> Environment Variables:
  WEEKEND_ADMIN_EMAIL     the admin's email
  WEEKEND_ADMIN_HASH      the printed value
  WEEKEND_SESSION_SECRET  any random string of 32+ characters
and redeploy.
"""
import base64
import getpass
import hashlib
import os

ITER = 210000


def make_hash(password, iterations=ITER):
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, iterations, 32)
    return f'pbkdf2${iterations}${base64.b64encode(salt).decode()}${base64.b64encode(dk).decode()}'


if __name__ == '__main__':
    pw = getpass.getpass('New admin password (12+ characters): ')
    if len(pw) < 12 or pw != getpass.getpass('Repeat: '):
        raise SystemExit('Passwords must match and be at least 12 characters.')
    print(make_hash(pw))
