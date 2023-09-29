fs = ["aad", "aei", "a", "caan", "sssssss"]


def is_palindrome(s):
    left, right = 0, len(s) - 1

    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1

    return True


for f in fs:
    print(f, end=" -> ")

    f = f[:-1] + "c"
    c = 0
    n = len(f)

    for i in range((n)):
        if is_palindrome(f):
            print(c)
            break
        f = f[:i] + f[n-1-i] + f[i:]
        n += 1
        c += 1
