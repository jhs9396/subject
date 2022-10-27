from app.vo.user import user


def execute(d, script):
    exec(script)

    for col in d.keys():
        d[col] = locals()[col]

    for key in list(locals().keys()):
        user.set_inner_data(key, locals()[key])

    return d