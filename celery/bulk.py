# http://celeryq.org/docs/userguide/executing.html

from time import time
from tasks import add

def bulk_add(num=1000):
    publisher = add.get_publisher()
    try:
        start = time()
        results = [add.apply_async(args=(i, i + 1), publisher=publisher) for i in range(num)]
        t_in = time() - start
    finally:
        publisher.close()
        publisher.connection.close()

    start = time()
    [res.get() for res in results]
    t_out = time() - start
    return t_in, t_out

if __name__ == '__main__':
    import sys
    num = int(sys.argv[1])
    t_in, t_out = bulk_add(num)
    print "in : %d in %fs (~ %d messages/seconds)"%(num, t_in, int(num/t_in))
    print "out: %d in %fs (~ %d messages/seconds)"%(num, t_out, int(num/t_out))
