while True:
    decimals = input("请输入十进制数字，使用逗号分隔 (输入 'q' 退出): ")
    
    if decimals.lower() == 'q':
        break
    
    decimal_list = decimals.split(",")
    
    hexadecimal = ""
    for decimal in decimal_list:
        decimal = int(decimal.strip())
        hexadecimal += hex(decimal)[2:].zfill(2)
    
    print("拼接后的十六进制:", hexadecimal)
